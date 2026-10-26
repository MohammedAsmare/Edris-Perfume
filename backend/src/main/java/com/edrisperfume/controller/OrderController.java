package com.edrisperfume.controller;

import com.edrisperfume.domain.entity.Order;
import com.edrisperfume.domain.entity.OrderItem;
import com.edrisperfume.domain.entity.Product;
import com.edrisperfume.domain.entity.User;
import com.edrisperfume.domain.enums.OrderStatus;
import com.edrisperfume.domain.enums.PaymentStatus;
import com.edrisperfume.repository.OrderRepository;
import com.edrisperfume.repository.ProductRepository;
import com.edrisperfume.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.security.Principal;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;
    private final com.edrisperfume.service.OrderAuditService auditService;

    @GetMapping("/{orderId}/timeline")
    public ResponseEntity<List<com.edrisperfume.domain.entity.OrderStatusHistory>> getOrderTimeline(@PathVariable Long orderId) {
        return ResponseEntity.ok(auditService.getOrderTimeline(orderId));
    }

    @GetMapping
    public ResponseEntity<List<Order>> getOrders(Principal principal) {
        String email = principal != null ? principal.getName() : "customer@edrisperfume.et";
        User customer = userRepository.findByEmail(email).orElse(null);
        if (customer != null) {
            return ResponseEntity.ok(orderRepository.findByCustomerIdOrderByCreatedAtDesc(customer.getId()));
        }
        return ResponseEntity.ok(orderRepository.findAll());
    }

    @GetMapping("/{orderId}")
    public ResponseEntity<Order> getOrderById(@PathVariable Long orderId) {
        return orderRepository.findById(orderId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Order> createOrder(@RequestBody Map<String, Object> payload, Principal principal) {
        String email = principal != null ? principal.getName() : "customer@edrisperfume.et";
        User customer = userRepository.findByEmail(email).orElseGet(() -> userRepository.findAll().get(0));

        String orderNumber = "EDR-2026-" + UUID.randomUUID().toString().substring(0, 5).toUpperCase();

        BigDecimal subtotal = new BigDecimal(payload.getOrDefault("subtotal", "14500").toString());
        BigDecimal deliveryFee = new BigDecimal(payload.getOrDefault("deliveryFee", "150").toString());
        BigDecimal discount = new BigDecimal(payload.getOrDefault("discountAmount", "0").toString());
        BigDecimal total = subtotal.subtract(discount).add(deliveryFee);

        Order order = Order.builder()
                .orderNumber(orderNumber)
                .customer(customer)
                .subtotal(subtotal)
                .discountAmount(discount)
                .deliveryFee(deliveryFee)
                .totalAmount(total)
                .currency("ETB")
                .shippingFullName((String) payload.getOrDefault("shippingFullName", "Selamawit Tadesse"))
                .shippingPhone((String) payload.getOrDefault("shippingPhone", "+251911223344"))
                .shippingCity((String) payload.getOrDefault("shippingCity", "Addis Ababa"))
                .shippingSubcity((String) payload.getOrDefault("shippingSubcity", "Bole"))
                .shippingAddressLine((String) payload.getOrDefault("shippingAddressLine", "Near Edna Mall"))
                .shippingNotes((String) payload.get("shippingNotes"))
                .orderStatus(OrderStatus.PENDING_PAYMENT)
                .paymentStatus(PaymentStatus.PENDING)
                .build();

        return ResponseEntity.ok(orderRepository.save(order));
    }
}
