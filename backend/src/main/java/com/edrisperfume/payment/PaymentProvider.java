package com.edrisperfume.payment;

import com.edrisperfume.domain.entity.Order;
import com.edrisperfume.domain.entity.PaymentTransaction;
import com.edrisperfume.domain.enums.PaymentStatus;

import java.util.Map;

public interface PaymentProvider {

    String getProviderCode();

    PaymentInitResponse initializePayment(Order order, PaymentTransaction transaction);

    PaymentVerifyResponse verifyPayment(PaymentTransaction transaction, Map<String, Object> payload);

    record PaymentInitResponse(
            String transactionReference,
            String checkoutUrl,
            String qrCodeData,
            String instructions,
            PaymentStatus initialStatus
    ) {}

    record PaymentVerifyResponse(
            boolean isSuccessful,
            String providerTransRef,
            String statusCode,
            String message,
            PaymentStatus resultingStatus
    ) {}
}
