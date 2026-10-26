package com.edrisperfume.controller;

import com.edrisperfume.domain.entity.MerchantProfile;
import com.edrisperfume.domain.entity.Order;
import com.edrisperfume.domain.entity.PaymentTransaction;
import com.edrisperfume.domain.entity.User;
import com.edrisperfume.domain.enums.MerchantApprovalStatus;
import com.edrisperfume.payment.PaymentReconciliationService;
import com.edrisperfume.repository.MerchantProfileRepository;
import com.edrisperfume.repository.PaymentTransactionRepository;
import com.edrisperfume.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/admin")
@RequiredArgsConstructor
public class AdminController {

    private final PaymentReconciliationService reconciliationService;
    private final MerchantProfileRepository merchantProfileRepository;
    private final PaymentTransactionRepository transactionRepository;
    private final UserRepository userRepository;

    @GetMapping("/merchants")
    public ResponseEntity<List<MerchantProfile>> getMerchants() {
        return ResponseEntity.ok(merchantProfileRepository.findAll());
    }

    @PostMapping("/merchants/{merchantId}/approval")
    public ResponseEntity<MerchantProfile> updateMerchantStatus(
            @PathVariable Long merchantId,
            @RequestBody Map<String, String> payload) {
        MerchantProfile merchant = merchantProfileRepository.findById(merchantId)
                .orElseThrow(() -> new IllegalArgumentException("Merchant not found: " + merchantId));

        String statusStr = payload.get("status");
        MerchantApprovalStatus status = MerchantApprovalStatus.valueOf(statusStr);
        merchant.setApprovalStatus(status);
        merchant.setRejectionReason(payload.get("rejectionReason"));

        return ResponseEntity.ok(merchantProfileRepository.save(merchant));
    }

    @GetMapping("/transactions")
    public ResponseEntity<List<PaymentTransaction>> getTransactions() {
        return ResponseEntity.ok(transactionRepository.findAll());
    }

    @PostMapping("/payments/{orderId}/reconcile")
    public ResponseEntity<Order> reconcilePayment(
            @PathVariable Long orderId,
            @RequestBody Map<String, Object> payload,
            Principal principal) {
        boolean approved = Boolean.TRUE.equals(payload.get("approved"));
        String reason = (String) payload.getOrDefault("reason", "Verified against bank statement.");

        String email = principal != null ? principal.getName() : "admin@edrisperfume.et";
        User admin = userRepository.findByEmail(email).orElse(null);

        return ResponseEntity.ok(reconciliationService.reconcilePayment(orderId, approved, reason, admin));
    }
}
