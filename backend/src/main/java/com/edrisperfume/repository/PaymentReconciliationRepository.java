package com.edrisperfume.repository;

import com.edrisperfume.domain.entity.PaymentReconciliation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PaymentReconciliationRepository extends JpaRepository<PaymentReconciliation, Long> {
    List<PaymentReconciliation> findByOrderId(Long orderId);
    List<PaymentReconciliation> findByTransactionId(Long transactionId);
}
