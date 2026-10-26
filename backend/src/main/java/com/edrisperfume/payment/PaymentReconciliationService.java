package com.edrisperfume.payment;

import com.edrisperfume.domain.entity.Order;
import com.edrisperfume.domain.entity.PaymentReconciliation;
import com.edrisperfume.domain.entity.PaymentTransaction;
import com.edrisperfume.domain.entity.User;
import com.edrisperfume.domain.enums.FulfillmentStatus;
import com.edrisperfume.domain.enums.OrderStatus;
import com.edrisperfume.domain.enums.PaymentStatus;
import com.edrisperfume.repository.OrderRepository;
import com.edrisperfume.repository.PaymentReconciliationRepository;
import com.edrisperfume.repository.PaymentTransactionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class PaymentReconciliationService {

    private final OrderRepository orderRepository;
    private final PaymentTransactionRepository transactionRepository;
    private final PaymentReconciliationRepository reconciliationRepository;

    @Transactional
    public Order reconcilePayment(Long orderId, boolean approved, String reason, User adminUser) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new IllegalArgumentException("Order not found: " + orderId));

        PaymentTransaction transaction = transactionRepository.findByOrderId(orderId)
                .orElseThrow(() -> new IllegalArgumentException("No transaction found for order: " + orderId));

        PaymentStatus previousStatus = transaction.getPaymentStatus();
        PaymentStatus newStatus = approved ? PaymentStatus.SUCCEEDED : PaymentStatus.FAILED;

        transaction.setPaymentStatus(newStatus);
        transaction.setAdminReconciliationNotes(reason);
        transaction.setVerifiedBy(adminUser);

        if (approved) {
            transaction.setVerifiedAmount(transaction.getExpectedAmount());
            transaction.setVerifiedAt(LocalDateTime.now());

            order.setPaymentStatus(PaymentStatus.SUCCEEDED);
            order.setOrderStatus(OrderStatus.CONFIRMED);
            order.setFulfillmentStatus(FulfillmentStatus.PICKING);
        } else {
            order.setPaymentStatus(PaymentStatus.FAILED);
        }

        PaymentReconciliation reconciliation = PaymentReconciliation.builder()
                .order(order)
                .transaction(transaction)
                .action(approved ? "VERIFIED" : "REJECTED")
                .previousStatus(previousStatus.name())
                .newStatus(newStatus.name())
                .reason(reason)
                .reconciledBy(adminUser)
                .build();

        reconciliationRepository.save(reconciliation);
        transactionRepository.save(transaction);
        return orderRepository.save(order);
    }
}
