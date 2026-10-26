package com.edrisperfume.repository;

import com.edrisperfume.domain.entity.Order;
import com.edrisperfume.domain.enums.OrderStatus;
import com.edrisperfume.domain.enums.PaymentStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    Optional<Order> findByOrderNumber(String orderNumber);
    List<Order> findByCustomerIdOrderByCreatedAtDesc(Long customerId);
    List<Order> findByOrderStatus(OrderStatus orderStatus);
    List<Order> findByPaymentStatus(PaymentStatus paymentStatus);
}
