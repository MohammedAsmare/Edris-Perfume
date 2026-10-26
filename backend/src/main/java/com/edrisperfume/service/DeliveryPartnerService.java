package com.edrisperfume.service;

import com.edrisperfume.domain.entity.*;
import com.edrisperfume.domain.enums.*;
import com.edrisperfume.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class DeliveryPartnerService {

    private final DeliveryAssignmentRepository deliveryAssignmentRepository;
    private final DeliveryPartnerRepository deliveryPartnerRepository;
    private final OrderRepository orderRepository;
    private final OrderAuditService auditService;

    /**
     * Retrieve deliveries assigned to authenticated courier.
     */
    public List<DeliveryAssignment> getAssignedDeliveries(User partnerUser) {
        DeliveryPartner partner = deliveryPartnerRepository.findByUserId(partnerUser.getId())
                .orElseThrow(() -> new SecurityException("User is not registered as an authorized delivery partner."));
        return deliveryAssignmentRepository.findByDeliveryPartnerId(partner.getId());
    }

    /**
     * Delivery partner confirms package pickup from merchant.
     */
    @Transactional
    public DeliveryAssignment confirmPickup(Long assignmentId, User partnerUser) {
        DeliveryAssignment assignment = findAndValidatePartnerAssignment(assignmentId, partnerUser);

        // Idempotency: If already picked up or in transit, return current
        if (assignment.getStatus() == DeliveryAssignmentStatus.PICKED_UP ||
            assignment.getStatus() == DeliveryAssignmentStatus.IN_TRANSIT) {
            return assignment;
        }

        if (assignment.getStatus() != DeliveryAssignmentStatus.ASSIGNED) {
            throw new IllegalStateException("Cannot confirm pickup. Current status is " + assignment.getStatus());
        }

        assignment.setStatus(DeliveryAssignmentStatus.PICKED_UP);
        assignment.setPickupConfirmedAt(LocalDateTime.now());
        assignment = deliveryAssignmentRepository.save(assignment);

        Order order = assignment.getOrder();
        order.setFulfillmentStatus(FulfillmentStatus.PICKED_UP);
        orderRepository.save(order);

        auditService.recordTransition(
                order,
                order.getOrderStatus().name(),
                order.getOrderStatus().name(),
                FulfillmentStatus.PACKED.name(),
                FulfillmentStatus.PICKED_UP.name(),
                "COURIER_PICKUP_CONFIRMED",
                partnerUser,
                "ROLE_DELIVERY_PARTNER",
                "Courier " + assignment.getDeliveryPartner().getPartnerName() + " confirmed package pickup from merchant."
        );

        return assignment;
    }

    /**
     * Delivery partner marks package In Transit / Out for Delivery.
     */
    @Transactional
    public DeliveryAssignment startDelivery(Long assignmentId, User partnerUser) {
        DeliveryAssignment assignment = findAndValidatePartnerAssignment(assignmentId, partnerUser);

        if (assignment.getStatus() == DeliveryAssignmentStatus.IN_TRANSIT) {
            return assignment; // Idempotent
        }

        if (assignment.getStatus() != DeliveryAssignmentStatus.PICKED_UP &&
            assignment.getStatus() != DeliveryAssignmentStatus.ASSIGNED) {
            throw new IllegalStateException("Package must be picked up before starting delivery (Current: " + assignment.getStatus() + ")");
        }

        assignment.setStatus(DeliveryAssignmentStatus.IN_TRANSIT);
        assignment.setStartedAt(LocalDateTime.now());
        assignment = deliveryAssignmentRepository.save(assignment);

        Order order = assignment.getOrder();
        String prevOrderStatus = order.getOrderStatus().name();
        String prevFulfillment = order.getFulfillmentStatus().name();

        order.setOrderStatus(OrderStatus.SHIPPED);
        order.setFulfillmentStatus(FulfillmentStatus.DISPATCHED);
        orderRepository.save(order);

        auditService.recordTransition(
                order,
                prevOrderStatus,
                OrderStatus.SHIPPED.name(),
                prevFulfillment,
                FulfillmentStatus.DISPATCHED.name(),
                "DELIVERY_STARTED_IN_TRANSIT",
                partnerUser,
                "ROLE_DELIVERY_PARTNER",
                "Package is in transit. Courier dispatched to customer location."
        );

        return assignment;
    }

    /**
     * Delivery partner confirms successful handover using recipient One-Time Code (OTP).
     * Rule 9: Delivery partner cannot close orders or modify payment status.
     * Rule 7: Successful delivery creates a pending merchant-verification step.
     */
    @Transactional
    public DeliveryAssignment confirmDelivery(
            Long assignmentId,
            String otpCode,
            String recipientName,
            String notes,
            User partnerUser) {

        DeliveryAssignment assignment = findAndValidatePartnerAssignment(assignmentId, partnerUser);

        if (assignment.getStatus() == DeliveryAssignmentStatus.DELIVERED) {
            return assignment; // Prevent duplicate
        }

        if (assignment.getStatus() != DeliveryAssignmentStatus.IN_TRANSIT &&
            assignment.getStatus() != DeliveryAssignmentStatus.PICKED_UP) {
            throw new IllegalStateException("Delivery must be in transit to record delivery (Current: " + assignment.getStatus() + ")");
        }

        // Brute-force protection
        if (assignment.getOtpAttempts() >= assignment.getMaxOtpAttempts()) {
            throw new SecurityException("Maximum verification PIN attempts exceeded. Delivery locked for audit.");
        }

        // Verify Recipient OTP
        if (otpCode == null || !assignment.getDeliveryOtp().trim().equalsIgnoreCase(otpCode.trim())) {
            assignment.setOtpAttempts(assignment.getOtpAttempts() + 1);
            deliveryAssignmentRepository.save(assignment);
            int remaining = assignment.getMaxOtpAttempts() - assignment.getOtpAttempts();
            throw new IllegalArgumentException("Invalid customer delivery verification PIN. " + remaining + " attempts remaining.");
        }

        assignment.setStatus(DeliveryAssignmentStatus.DELIVERED);
        assignment.setDeliveredAt(LocalDateTime.now());
        assignment.setRecipientName(recipientName != null ? recipientName : assignment.getOrder().getShippingFullName());
        assignment.setRecipientNotes(notes);
        assignment.setProofCode("PROOF-OTP-" + assignment.getDeliveryOtp() + "-" + UUID.randomUUID().toString().substring(0, 6).toUpperCase());
        assignment = deliveryAssignmentRepository.save(assignment);

        Order order = assignment.getOrder();
        String prevFulfillment = order.getFulfillmentStatus().name();

        // Update fulfillment status to DELIVERED; order remains open for merchant review (Rule 7 & 8)
        order.setFulfillmentStatus(FulfillmentStatus.DELIVERED);
        orderRepository.save(order);

        auditService.recordTransition(
                order,
                order.getOrderStatus().name(),
                order.getOrderStatus().name(),
                prevFulfillment,
                FulfillmentStatus.DELIVERED.name(),
                "DELIVERY_CONFIRMED_WITH_OTP",
                partnerUser,
                "ROLE_DELIVERY_PARTNER",
                "Recipient " + assignment.getRecipientName() + " verified delivery with one-time code. Proof Code: " + assignment.getProofCode()
        );

        return assignment;
    }

    /**
     * Delivery partner records delivery failure with mandatory reason.
     * Rule 12: A failed delivery must not allow the order to be closed as successfully delivered.
     */
    @Transactional
    public DeliveryAssignment failDelivery(Long assignmentId, String reason, User partnerUser) {
        if (reason == null || reason.trim().isBlank()) {
            throw new IllegalArgumentException("A specific failure reason is required.");
        }

        DeliveryAssignment assignment = findAndValidatePartnerAssignment(assignmentId, partnerUser);

        if (assignment.getStatus() == DeliveryAssignmentStatus.DELIVERED) {
            throw new IllegalStateException("Cannot mark an already delivered order as failed.");
        }

        assignment.setStatus(DeliveryAssignmentStatus.FAILED);
        assignment.setFailedAt(LocalDateTime.now());
        assignment.setFailureReason(reason);
        assignment = deliveryAssignmentRepository.save(assignment);

        Order order = assignment.getOrder();
        String prevFulfillment = order.getFulfillmentStatus().name();

        order.setFulfillmentStatus(FulfillmentStatus.DELIVERY_FAILED);
        orderRepository.save(order);

        auditService.recordTransition(
                order,
                order.getOrderStatus().name(),
                order.getOrderStatus().name(),
                prevFulfillment,
                FulfillmentStatus.DELIVERY_FAILED.name(),
                "DELIVERY_FAILED",
                partnerUser,
                "ROLE_DELIVERY_PARTNER",
                "Delivery attempt failed. Reason: " + reason
        );

        return assignment;
    }

    private DeliveryAssignment findAndValidatePartnerAssignment(Long assignmentId, User partnerUser) {
        DeliveryAssignment assignment = deliveryAssignmentRepository.findById(assignmentId)
                .orElseThrow(() -> new IllegalArgumentException("Delivery assignment not found: " + assignmentId));

        if (partnerUser.getRole() == Role.ROLE_ADMIN) {
            return assignment;
        }

        DeliveryPartner partner = deliveryPartnerRepository.findByUserId(partnerUser.getId()).orElse(null);
        if (partner == null || !assignment.getDeliveryPartner().getId().equals(partner.getId())) {
            throw new SecurityException("Unauthorized: You are not the assigned delivery partner for this package.");
        }

        return assignment;
    }
}
