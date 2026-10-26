package com.edrisperfume;

import com.edrisperfume.domain.entity.Order;
import com.edrisperfume.domain.entity.PaymentMethod;
import com.edrisperfume.domain.entity.PaymentTransaction;
import com.edrisperfume.domain.entity.User;
import com.edrisperfume.domain.enums.OrderStatus;
import com.edrisperfume.domain.enums.PaymentStatus;
import com.edrisperfume.domain.enums.Role;
import com.edrisperfume.payment.BankTransferPaymentProvider;
import com.edrisperfume.payment.PaymentProvider;
import com.edrisperfume.payment.PaymentReconciliationService;
import com.edrisperfume.payment.TelebirrPaymentProvider;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.math.BigDecimal;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;

class PaymentServiceTest {

    private TelebirrPaymentProvider telebirrProvider;
    private BankTransferPaymentProvider bankTransferProvider;
    private Order testOrder;
    private PaymentTransaction testTransaction;

    @BeforeEach
    void setUp() {
        telebirrProvider = new TelebirrPaymentProvider();
        bankTransferProvider = new BankTransferPaymentProvider();

        User customer = User.builder()
                .id(1L)
                .email("customer@edrisperfume.et")
                .firstName("Selamawit")
                .lastName("Tadesse")
                .role(Role.ROLE_CUSTOMER)
                .build();

        testOrder = Order.builder()
                .id(101L)
                .orderNumber("EDR-2026-TEST1")
                .customer(customer)
                .totalAmount(new BigDecimal("14500.00"))
                .currency("ETB")
                .orderStatus(OrderStatus.PENDING_PAYMENT)
                .paymentStatus(PaymentStatus.PENDING)
                .build();

        testTransaction = PaymentTransaction.builder()
                .id(201L)
                .transactionReference("TXN-EDR-TEST-998")
                .order(testOrder)
                .expectedAmount(new BigDecimal("14500.00"))
                .currency("ETB")
                .merchantOrderRef("EDR-2026-TEST1")
                .paymentStatus(PaymentStatus.INITIATED)
                .build();
    }

    @Test
    @DisplayName("Telebirr initialization should produce correct reference and INITIATED status")
    void testTelebirrInitialization() {
        PaymentProvider.PaymentInitResponse response = telebirrProvider.initializePayment(testOrder, testTransaction);

        assertNotNull(response);
        assertEquals("TXN-EDR-TEST-998", response.transactionReference());
        assertEquals(PaymentStatus.INITIATED, response.initialStatus());
        assertNotNull(response.checkoutUrl());
        assertTrue(response.checkoutUrl().contains("14500.00"));
    }

    @Test
    @DisplayName("Telebirr webhook verification with SUCCESS should transition to SUCCEEDED")
    void testTelebirrVerificationSuccess() {
        Map<String, Object> payload = Map.of(
                "trade_status", "SUCCESS",
                "out_trade_no", "TXN-EDR-TEST-998"
        );

        PaymentProvider.PaymentVerifyResponse response = telebirrProvider.verifyPayment(testTransaction, payload);

        assertTrue(response.isSuccessful());
        assertEquals(PaymentStatus.SUCCEEDED, response.resultingStatus());
    }

    @Test
    @DisplayName("Bank transfer initiation must enter AWAITING_CUSTOMER_ACTION without marking paid")
    void testBankTransferInitiationPending() {
        PaymentProvider.PaymentInitResponse response = bankTransferProvider.initializePayment(testOrder, testTransaction);

        assertNotNull(response);
        assertEquals(PaymentStatus.AWAITING_CUSTOMER_ACTION, response.initialStatus());
        assertNull(response.checkoutUrl());
        assertTrue(response.instructions().contains("EDRIS PERFUME"));
    }

    @Test
    @DisplayName("Bank transfer verification without admin audit must remain in PROCESSING")
    void testBankTransferRequiresReconciliation() {
        Map<String, Object> unverifiedPayload = Map.of(
                "admin_reconciled", false,
                "reason", "Unverified customer transfer claim"
        );

        PaymentProvider.PaymentVerifyResponse response = bankTransferProvider.verifyPayment(testTransaction, unverifiedPayload);

        assertFalse(response.isSuccessful());
        assertEquals(PaymentStatus.PROCESSING, response.resultingStatus());
    }

    @Test
    @DisplayName("Bank transfer with authoritative admin statement match transitions to SUCCEEDED")
    void testBankTransferAuthorizedReconciliation() {
        Map<String, Object> reconciledPayload = Map.of(
                "admin_reconciled", true,
                "reason", "Verified in CBE Finfine branch statement"
        );

        PaymentProvider.PaymentVerifyResponse response = bankTransferProvider.verifyPayment(testTransaction, reconciledPayload);

        assertTrue(response.isSuccessful());
        assertEquals(PaymentStatus.SUCCEEDED, response.resultingStatus());
    }
}
