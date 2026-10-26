package com.edrisperfume.payment;

import com.edrisperfume.domain.entity.Order;
import com.edrisperfume.domain.entity.PaymentMethod;
import com.edrisperfume.domain.entity.PaymentTransaction;
import com.edrisperfume.domain.entity.User;
import com.edrisperfume.domain.enums.FulfillmentStatus;
import com.edrisperfume.domain.enums.OrderStatus;
import com.edrisperfume.domain.enums.PaymentStatus;
import com.edrisperfume.repository.OrderRepository;
import com.edrisperfume.repository.PaymentMethodRepository;
import com.edrisperfume.repository.PaymentTransactionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class PaymentService {

    private final OrderRepository orderRepository;
    private final PaymentTransactionRepository transactionRepository;
    private final PaymentMethodRepository paymentMethodRepository;
    private final TelebirrPaymentProvider telebirrPaymentProvider;
    private final BankTransferPaymentProvider bankTransferPaymentProvider;

    @Transactional
    public PaymentProvider.PaymentInitResponse initiatePayment(Long orderId, String paymentMethodCode) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new IllegalArgumentException("Order not found: " + orderId));

        PaymentMethod method = paymentMethodRepository.findByCode(paymentMethodCode)
                .orElse(null);

        String txnRef = "TXN-EDR-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();

        PaymentTransaction transaction = PaymentTransaction.builder()
                .transactionReference(txnRef)
                .order(order)
                .customer(order.getCustomer())
                .paymentMethod(method)
                .provider(paymentMethodCode.startsWith("BANK_TRANSFER") ? "BANK_TRANSFER" : paymentMethodCode)
                .merchantOrderRef(order.getOrderNumber())
                .expectedAmount(order.getTotalAmount())
                .currency(order.getCurrency())
                .paymentStatus(PaymentStatus.INITIATED)
                .expiresAt(LocalDateTime.now().plusHours(24))
                .build();

        transaction = transactionRepository.save(transaction);

        PaymentProvider provider = paymentMethodCode.startsWith("BANK_TRANSFER")
                ? bankTransferPaymentProvider
                : telebirrPaymentProvider;

        PaymentProvider.PaymentInitResponse initResponse = provider.initializePayment(order, transaction);

        order.setPaymentStatus(initResponse.initialStatus());
        orderRepository.save(order);

        return initResponse;
    }

    @Transactional
    public PaymentTransaction submitBankProof(Long orderId, String transferRef, String notes) {
        PaymentTransaction transaction = transactionRepository.findByOrderId(orderId)
                .orElseThrow(() -> new IllegalArgumentException("No payment transaction found for order: " + orderId));

        transaction.setTransferProofReference(transferRef);
        transaction.setCustomerNotes(notes);
        transaction.setPaymentStatus(PaymentStatus.PROCESSING);

        Order order = transaction.getOrder();
        order.setPaymentStatus(PaymentStatus.PROCESSING);
        orderRepository.save(order);

        return transactionRepository.save(transaction);
    }

    @Transactional
    public void processTelebirrWebhook(Map<String, Object> payload) {
        String merchantOrderRef = (String) payload.get("out_trade_no");
        if (merchantOrderRef == null) return;

        transactionRepository.findByMerchantOrderRef(merchantOrderRef).ifPresent(txn -> {
            PaymentProvider.PaymentVerifyResponse result = telebirrPaymentProvider.verifyPayment(txn, payload);

            txn.setPaymentStatus(result.resultingStatus());
            txn.setProviderStatusCode(result.statusCode());
            txn.setProviderTransRef(result.providerTransRef());

            if (result.isSuccessful()) {
                txn.setVerifiedAmount(txn.getExpectedAmount());
                txn.setVerifiedAt(LocalDateTime.now());

                Order order = txn.getOrder();
                order.setPaymentStatus(PaymentStatus.SUCCEEDED);
                order.setOrderStatus(OrderStatus.CONFIRMED);
                order.setFulfillmentStatus(FulfillmentStatus.PICKING);
                orderRepository.save(order);
            }
            transactionRepository.save(txn);
        });
    }
}
