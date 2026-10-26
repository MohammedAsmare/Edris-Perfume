package com.edrisperfume.payment;

import com.edrisperfume.domain.entity.Order;
import com.edrisperfume.domain.entity.PaymentTransaction;
import com.edrisperfume.domain.enums.PaymentStatus;
import org.springframework.stereotype.Component;

import java.util.Map;

@Component
public class BankTransferPaymentProvider implements PaymentProvider {

    @Override
    public String getProviderCode() {
        return "BANK_TRANSFER";
    }

    @Override
    public PaymentInitResponse initializePayment(Order order, PaymentTransaction transaction) {
        String instructions = "Deposit to official EDRIS PERFUME corporate account (CBE / Awash / Dashen / BoA). "
                + "Quote order number " + order.getOrderNumber() + " in transfer remark.";

        return new PaymentInitResponse(
                transaction.getTransactionReference(),
                null,
                null,
                instructions,
                PaymentStatus.AWAITING_CUSTOMER_ACTION
        );
    }

    @Override
    public PaymentVerifyResponse verifyPayment(PaymentTransaction transaction, Map<String, Object> payload) {
        // Section 8.3: Never claim an ordinary bank transfer is automatically verified without authoritative reconciliation
        boolean isReconciled = Boolean.TRUE.equals(payload.get("admin_reconciled"));
        String reason = (String) payload.getOrDefault("reason", "Verified against bank statement");

        if (isReconciled) {
            return new PaymentVerifyResponse(
                    true,
                    transaction.getTransferProofReference(),
                    "STATEMENT_MATCHED",
                    reason,
                    PaymentStatus.SUCCEEDED
            );
        } else {
            return new PaymentVerifyResponse(
                    false,
                    transaction.getTransferProofReference(),
                    "UNVERIFIED_CLAIM",
                    "Customer claim submitted; awaiting authoritative bank reconciliation",
                    PaymentStatus.PROCESSING
            );
        }
    }
}
