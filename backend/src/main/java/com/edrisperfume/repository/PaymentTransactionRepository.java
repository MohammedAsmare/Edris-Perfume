package com.edrisperfume.repository;

import com.edrisperfume.domain.entity.PaymentTransaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PaymentTransactionRepository extends JpaRepository<PaymentTransaction, Long> {
    Optional<PaymentTransaction> findByTransactionReference(String transactionReference);
    Optional<PaymentTransaction> findByMerchantOrderRef(String merchantOrderRef);
    Optional<PaymentTransaction> findByOrderId(Long orderId);
    List<PaymentTransaction> findByCustomerId(Long customerId);
}
