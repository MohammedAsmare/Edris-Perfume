package com.edrisperfume.service;

import com.edrisperfume.domain.entity.*;
import com.edrisperfume.domain.enums.*;
import com.edrisperfume.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class MerchantOrderDispatchService {

    private final OrderRepository orderRepository;
    private final MerchantProfileRepository merchantProfileRepository;
    private final DeliveryPartnerRepository deliveryPartnerRepository;
    private final DeliveryAssignmentRepository deliveryAssignmentRepository;
    private final OrderAuditService auditService;

    private static final SecureRandom RANDOM = new SecureRandom();

    /**
     * Merchant accepts a paid or verified order and begins fragrant packaging.
     */
    @Transactional
    public Order acceptOrder(Long orderId, User merchantUser) {
        Order order = findOrderAndValidateMerchant(orderId, merchantUser);

        // Business Rule: Order must be paid or Cash on Delivery before processing
        if (order.getPaymentStatus() != PaymentStatus.SUCCEEDED &&
            (order.getPaymentMethod() == null || !order.getPaymentMethod().contains("CASH"))) {
            throw new IllegalStateException("Cannot accept order: Payment is not verified (Current: " + order.getPaymentStatus() + ")");
        }

        if (order.getFulfillmentStatus() != FulfillmentStatus.UNFULFILLED) {
            throw new IllegalStateException("Order is already in progress: " + order.getFulfillmentStatus());
        }

        String prevOrderStatus = order.getOrderStatus().name();
        String prevFulfillment = order.getFulfillmentStatus().name();

        order.setOrderStatus(OrderStatus.PROCESSING);
        order.setFulfillmentStatus(FulfillmentStatus.PICKING);
        order.setAcceptedAt(LocalDateTime.now());
        order = orderRepository.save(order);

        auditService.recordTransition(
                order,
                prevOrderStatus,
                order.getOrderStatus().name(),
                prevFulfillment,
                order.getFulfillmentStatus().name(),
                "ORDER_ACCEPTED",
                merchantUser,
                "ROLE_MERCHANT",
                "Merchant accepted order and initiated packaging."
        );

        return order;
    }

    /**
     * Merchant finishes packing and seals package with gold seal.
     */
    @Transactional
    public Order markReadyForPickup(Long orderId, User merchantUser) {
        Order order = findOrderAndValidateMerchant(orderId, merchantUser);

        if (order.getFulfillmentStatus() != FulfillmentStatus.PICKING) {
            throw new IllegalStateException("Order must be in PICKING status to mark ready for pickup (Current: " + order.getFulfillmentStatus() + ")");
        }

        String prevOrderStatus = order.getOrderStatus().name();
        String prevFulfillment = order.getFulfillmentStatus().name();

        order.setOrderStatus(OrderStatus.READY_FOR_DISPATCH);
        order.setFulfillmentStatus(FulfillmentStatus.PACKED);
        order.setReadyPickupAt(LocalDateTime.now());
        order = orderRepository.save(order);

        auditService.recordTransition(
                order,
                prevOrderStatus,
                order.getOrderStatus().name(),
                prevFulfillment,
                order.getFulfillmentStatus().name(),
                "READY_FOR_PICKUP",
                merchantUser,
                "ROLE_MERCHANT",
                "Order packed in luxury velvet box with gold monogram seal. Ready for courier pickup."
        );

        return order;
    }

    /**
     * Merchant assigns an authorized delivery partner and generates a secure delivery OTP.
     */
    @Transactional
    public DeliveryAssignment assignDeliveryPartner(Long orderId, Long deliveryPartnerId, User merchantUser) {
        Order order = findOrderAndValidateMerchant(orderId, merchantUser);

        DeliveryPartner partner = deliveryPartnerRepository.findById(deliveryPartnerId)
                .orElseThrow(() -> new IllegalArgumentException("Delivery partner not found: " + deliveryPartnerId));

        if (!"ACTIVE".equalsIgnoreCase(partner.getStatus())) {
            throw new IllegalStateException("Delivery partner is currently inactive.");
        }

        MerchantProfile merchant = merchantProfileRepository.findByUserId(merchantUser.getId()).orElse(null);

        // Generate secure 6-digit confirmation PIN for customer recipient
        String otp = String.format("%06d", RANDOM.nextInt(1000000));
        order.setDeliveryOtp(otp);
        order = orderRepository.save(order);

        String pickupAddr = merchant != null && merchant.getAddress() != null
                ? merchant.getAddress()
                : "Bole Medhanialem Arcade, 2nd Floor, Addis Ababa";

        String deliveryAddr = order.getShippingAddressLine() + ", "
                + (order.getShippingSubcity() != null ? order.getShippingSubcity() + ", " : "")
                + order.getShippingCity();

        // Check for existing assignment or create new
        DeliveryAssignment assignment = deliveryAssignmentRepository.findByOrderId(order.getId())
                .orElse(DeliveryAssignment.builder()
                        .order(order)
                        .merchant(merchant)
                        .build());

        assignment.setDeliveryPartner(partner);
        assignment.setAssignedBy(merchantUser);
        assignment.setStatus(DeliveryAssignmentStatus.ASSIGNED);
        assignment.setPickupAddress(pickupAddr);
        assignment.setDeliveryAddress(deliveryAddr);
        assignment.setDeliveryOtp(otp);
        assignment.setOtpAttempts(0);
        assignment.setRecipientName(order.getShippingFullName());

        assignment = deliveryAssignmentRepository.save(assignment);

        auditService.recordTransition(
                order,
                order.getOrderStatus().name(),
                order.getOrderStatus().name(),
                order.getFulfillmentStatus().name(),
                order.getFulfillmentStatus().name(),
                "DELIVERY_PARTNER_ASSIGNED",
                merchantUser,
                "ROLE_MERCHANT",
                "Assigned delivery partner: " + partner.getPartnerName() + " (" + partner.getVehicleType() + " - " + partner.getLicensePlate() + ")"
        );

        return assignment;
    }

    /**
     * Merchant records physical package handover to delivery partner.
     */
    @Transactional
    public DeliveryAssignment recordHandover(Long orderId, User merchantUser) {
        Order order = findOrderAndValidateMerchant(orderId, merchantUser);

        DeliveryAssignment assignment = deliveryAssignmentRepository.findByOrderId(order.getId())
                .orElseThrow(() -> new IllegalStateException("No delivery partner assigned to order: " + orderId));

        assignment.setStatus(DeliveryAssignmentStatus.PICKED_UP);
        assignment.setPickupConfirmedAt(LocalDateTime.now());
        assignment = deliveryAssignmentRepository.save(assignment);

        auditService.recordTransition(
                order,
                order.getOrderStatus().name(),
                order.getOrderStatus().name(),
                order.getFulfillmentStatus().name(),
                order.getFulfillmentStatus().name(),
                "PACKAGE_HANDED_OVER",
                merchantUser,
                "ROLE_MERCHANT",
                "Package physically handed over to courier " + assignment.getDeliveryPartner().getPartnerName()
        );

        return assignment;
    }

    /**
     * Merchant reviews delivery confirmation & OTP proof, then permanently closes the order.
     * Business Rule 8: Close an order ONLY after successful delivery confirmation.
     * Business Rule 12: A failed delivery must NOT allow the order to be closed as successfully delivered.
     */
    @Transactional
    public Order closeOrder(Long orderId, String notes, User merchantUser) {
        Order order = findOrderAndValidateMerchant(orderId, merchantUser);

        DeliveryAssignment assignment = deliveryAssignmentRepository.findByOrderId(order.getId())
                .orElseThrow(() -> new IllegalStateException("No delivery assignment record for order: " + orderId));

        if (assignment.getStatus() != DeliveryAssignmentStatus.DELIVERED) {
            throw new IllegalStateException("Cannot close order: Delivery status is " + assignment.getStatus() + ". Order can only be closed after verified delivery.");
        }

        if (order.getFulfillmentStatus() != FulfillmentStatus.DELIVERED) {
            throw new IllegalStateException("Cannot close order: Fulfillment status is " + order.getFulfillmentStatus());
        }

        String prevOrderStatus = order.getOrderStatus().name();
        String prevFulfillment = order.getFulfillmentStatus().name();

        order.setOrderStatus(OrderStatus.DELIVERED);
        order.setClosedAt(LocalDateTime.now());
        order.setClosedBy(merchantUser);
        order = orderRepository.save(order);

        auditService.recordTransition(
                order,
                prevOrderStatus,
                order.getOrderStatus().name(),
                prevFulfillment,
                order.getFulfillmentStatus().name(),
                "ORDER_CLOSED",
                merchantUser,
                "ROLE_MERCHANT",
                "Merchant reviewed recipient proof and closed order. " + (notes != null ? notes : "")
        );

        return order;
    }

    /**
     * Merchant or admin cancellation handling.
     */
    @Transactional
    public Order cancelOrder(Long orderId, String reason, User merchantUser) {
        Order order = findOrderAndValidateMerchant(orderId, merchantUser);

        if (order.getOrderStatus() == OrderStatus.DELIVERED || order.getFulfillmentStatus() == FulfillmentStatus.DELIVERED) {
            throw new IllegalStateException("Cannot cancel a completed and delivered order.");
        }

        String prevOrderStatus = order.getOrderStatus().name();
        String prevFulfillment = order.getFulfillmentStatus().name();

        order.setOrderStatus(OrderStatus.CANCELLED);
        order = orderRepository.save(order);

        deliveryAssignmentRepository.findByOrderId(orderId).ifPresent(a -> {
            a.setStatus(DeliveryAssignmentStatus.CANCELLED);
            a.setFailureReason("Order cancelled by merchant: " + reason);
            deliveryAssignmentRepository.save(a);
        });

        auditService.recordTransition(
                order,
                prevOrderStatus,
                order.getOrderStatus().name(),
                prevFulfillment,
                order.getFulfillmentStatus().name(),
                "ORDER_CANCELLED",
                merchantUser,
                "ROLE_MERCHANT",
                "Order cancelled by merchant. Reason: " + reason
        );

        return order;
    }

    /**
     * Validates that order exists and belongs to the merchant (or merchant has access).
     */
    private Order findOrderAndValidateMerchant(Long orderId, User merchantUser) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new IllegalArgumentException("Order not found: " + orderId));

        if (merchantUser.getRole() == Role.ROLE_ADMIN) {
            return order;
        }

        MerchantProfile merchant = merchantProfileRepository.findByUserId(merchantUser.getId()).orElse(null);
        if (merchant == null) {
            throw new SecurityException("User is not registered as a merchant partner.");
        }

        // Validate that merchant owns products in this order
        boolean ownsProduct = order.getItems().isEmpty() || order.getItems().stream()
                .anyMatch(item -> item.getMerchant() != null && item.getMerchant().getId().equals(merchant.getId()));

        if (!ownsProduct && !order.getItems().isEmpty()) {
            throw new SecurityException("Unauthorized access: Order does not contain products from your boutique.");
        }

        return order;
    }
}
