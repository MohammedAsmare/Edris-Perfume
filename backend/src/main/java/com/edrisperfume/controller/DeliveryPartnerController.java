package com.edrisperfume.controller;

import com.edrisperfume.domain.entity.DeliveryAssignment;
import com.edrisperfume.domain.entity.DeliveryPartner;
import com.edrisperfume.domain.entity.User;
import com.edrisperfume.repository.DeliveryPartnerRepository;
import com.edrisperfume.repository.UserRepository;
import com.edrisperfume.service.DeliveryPartnerService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/delivery")
@RequiredArgsConstructor
public class DeliveryPartnerController {

    private final DeliveryPartnerService deliveryPartnerService;
    private final DeliveryPartnerRepository deliveryPartnerRepository;
    private final UserRepository userRepository;

    @GetMapping("/partners")
    public ResponseEntity<List<DeliveryPartner>> getAvailablePartners() {
        return ResponseEntity.ok(deliveryPartnerRepository.findByStatus("ACTIVE"));
    }

    @GetMapping("/assignments")
    public ResponseEntity<List<DeliveryAssignment>> getAssignedDeliveries(Principal principal) {
        User partnerUser = getAuthenticatedUser(principal, "delivery@edrisperfume.et");
        return ResponseEntity.ok(deliveryPartnerService.getAssignedDeliveries(partnerUser));
    }

    @PostMapping("/assignments/{assignmentId}/confirm-pickup")
    public ResponseEntity<DeliveryAssignment> confirmPickup(
            @PathVariable Long assignmentId,
            Principal principal) {
        User partnerUser = getAuthenticatedUser(principal, "delivery@edrisperfume.et");
        return ResponseEntity.ok(deliveryPartnerService.confirmPickup(assignmentId, partnerUser));
    }

    @PostMapping("/assignments/{assignmentId}/start")
    public ResponseEntity<DeliveryAssignment> startDelivery(
            @PathVariable Long assignmentId,
            Principal principal) {
        User partnerUser = getAuthenticatedUser(principal, "delivery@edrisperfume.et");
        return ResponseEntity.ok(deliveryPartnerService.startDelivery(assignmentId, partnerUser));
    }

    @PostMapping("/assignments/{assignmentId}/confirm-delivery")
    public ResponseEntity<DeliveryAssignment> confirmDelivery(
            @PathVariable Long assignmentId,
            @RequestBody Map<String, String> payload,
            Principal principal) {
        User partnerUser = getAuthenticatedUser(principal, "delivery@edrisperfume.et");
        String otpCode = payload.get("otpCode");
        String recipientName = payload.get("recipientName");
        String notes = payload.get("notes");
        return ResponseEntity.ok(deliveryPartnerService.confirmDelivery(assignmentId, otpCode, recipientName, notes, partnerUser));
    }

    @PostMapping("/assignments/{assignmentId}/fail")
    public ResponseEntity<DeliveryAssignment> failDelivery(
            @PathVariable Long assignmentId,
            @RequestBody Map<String, String> payload,
            Principal principal) {
        User partnerUser = getAuthenticatedUser(principal, "delivery@edrisperfume.et");
        String reason = payload.get("reason");
        return ResponseEntity.ok(deliveryPartnerService.failDelivery(assignmentId, reason, partnerUser));
    }

    private User getAuthenticatedUser(Principal principal, String defaultEmail) {
        String email = principal != null ? principal.getName() : defaultEmail;
        return userRepository.findByEmail(email).orElseThrow(() -> new SecurityException("User not found: " + email));
    }
}
