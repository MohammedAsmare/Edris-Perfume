package com.edrisperfume.controller;

import com.edrisperfume.domain.entity.BankAccount;
import com.edrisperfume.domain.entity.PaymentMethod;
import com.edrisperfume.domain.entity.PaymentTransaction;
import com.edrisperfume.payment.PaymentProvider;
import com.edrisperfume.payment.PaymentService;
import com.edrisperfume.repository.BankAccountRepository;
import com.edrisperfume.repository.PaymentMethodRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/payments")
@RequiredArgsConstructor
public class PaymentController {

    private final PaymentService paymentService;
    private final PaymentMethodRepository paymentMethodRepository;
    private final BankAccountRepository bankAccountRepository;

    @GetMapping("/methods")
    public ResponseEntity<List<PaymentMethod>> getPaymentMethods() {
        return ResponseEntity.ok(paymentMethodRepository.findByIsActiveTrueOrderByDisplayOrderAsc());
    }

    @GetMapping("/bank-accounts")
    public ResponseEntity<List<BankAccount>> getBankAccounts() {
        return ResponseEntity.ok(bankAccountRepository.findByIsActiveTrue());
    }

    @PostMapping("/orders/{orderId}/initiate")
    public ResponseEntity<PaymentProvider.PaymentInitResponse> initiatePayment(
            @PathVariable Long orderId,
            @RequestParam(defaultValue = "TELEBIRR") String paymentMethodCode) {
        return ResponseEntity.ok(paymentService.initiatePayment(orderId, paymentMethodCode));
    }

    @PostMapping("/orders/{orderId}/bank-proof")
    public ResponseEntity<PaymentTransaction> submitBankProof(
            @PathVariable Long orderId,
            @RequestBody Map<String, String> payload) {
        String reference = payload.get("transferProofReference");
        String notes = payload.get("customerNotes");
        return ResponseEntity.ok(paymentService.submitBankProof(orderId, reference, notes));
    }

    @PostMapping("/webhooks/telebirr")
    public ResponseEntity<String> telebirrWebhook(@RequestBody Map<String, Object> payload) {
        paymentService.processTelebirrWebhook(payload);
        return ResponseEntity.ok("{\"code\": 0, \"msg\": \"success\"}");
    }
}
