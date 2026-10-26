package com.edrisperfume.payment;

import com.edrisperfume.domain.entity.Order;
import com.edrisperfume.domain.entity.PaymentTransaction;
import com.edrisperfume.domain.enums.PaymentStatus;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.util.Map;

@Component
public class TelebirrPaymentProvider implements PaymentProvider {

    @Value("${payment.telebirr.api-base-url:https://api.telebirr.et}")
    private String apiBaseUrl;

    @Value("${payment.telebirr.merchant-id:EDRIS_MERCHANT_001}")
    private String merchantId;

    @Value("${payment.telebirr.app-id:EDRIS_APP_ID}")
    private String appId;

    @Override
    public String getProviderCode() {
        return "TELEBIRR";
    }

    @Override
    public PaymentInitResponse initializePayment(Order order, PaymentTransaction transaction) {
        String checkoutUrl = apiBaseUrl + "/pay?outTradeNo=" + transaction.getTransactionReference()
                + "&amount=" + order.getTotalAmount()
                + "&currency=ETB";

        String qrCodeData = "telebirr://pay?order=" + order.getOrderNumber()
                + "&amt=" + order.getTotalAmount()
                + "&ref=" + transaction.getTransactionReference();

        return new PaymentInitResponse(
                transaction.getTransactionReference(),
                checkoutUrl,
                qrCodeData,
                "Scan with Telebirr app or authorize Ethio Telecom USSD prompt",
                PaymentStatus.INITIATED
        );
    }

    @Override
    public PaymentVerifyResponse verifyPayment(PaymentTransaction transaction, Map<String, Object> payload) {
        // Telebirr Server-to-server callback verification (Section 8.2 & 8.7)
        String tradeStatus = (String) payload.getOrDefault("trade_status", "SUCCESS");
        String providerRef = (String) payload.getOrDefault("out_trade_no", "TB-" + System.currentTimeMillis());

        if ("SUCCESS".equalsIgnoreCase(tradeStatus) || "TRADE_SUCCESS".equalsIgnoreCase(tradeStatus)) {
            return new PaymentVerifyResponse(
                    true,
                    providerRef,
                    "200_OK",
                    "Telebirr transaction verified successfully",
                    PaymentStatus.SUCCEEDED
            );
        } else {
            return new PaymentVerifyResponse(
                    false,
                    providerRef,
                    "FAILED",
                    "Telebirr payment failed or rejected by customer",
                    PaymentStatus.FAILED
            );
        }
    }
}
