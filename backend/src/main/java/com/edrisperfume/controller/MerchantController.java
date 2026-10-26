package com.edrisperfume.controller;

import com.edrisperfume.domain.entity.DeliveryAssignment;
import com.edrisperfume.domain.entity.Order;
import com.edrisperfume.domain.entity.Product;
import com.edrisperfume.domain.entity.User;
import com.edrisperfume.domain.enums.FulfillmentStatus;
import com.edrisperfume.domain.enums.OrderStatus;
import com.edrisperfume.repository.OrderRepository;
import com.edrisperfume.repository.ProductRepository;
import com.edrisperfume.repository.UserRepository;
import com.edrisperfume.service.MerchantOrderDispatchService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/merchant")
@RequiredArgsConstructor
public class MerchantController {

    private final ProductRepository productRepository;
    private final OrderRepository orderRepository;
    private final UserRepository userRepository;
    private final MerchantOrderDispatchService dispatchService;

    @GetMapping("/products")
    public ResponseEntity<List<Product>> getMerchantProducts(@RequestParam(defaultValue = "1") Long merchantId) {
        return ResponseEntity.ok(productRepository.findByMerchantId(merchantId));
    }

    @PostMapping("/products")
    public ResponseEntity<Product> saveProduct(@RequestBody Product product) {
        if (product.getSku() == null || product.getSku().isBlank()) {
            product.setSku("EDR-" + System.currentTimeMillis() % 100000);
        }
        return ResponseEntity.ok(productRepository.save(product));
    }

    @GetMapping("/orders")
    public ResponseEntity<List<Order>> getMerchantOrders() {
        return ResponseEntity.ok(orderRepository.findAll());
    }

    @GetMapping("/orders/{orderId}")
    public ResponseEntity<Order> getOrderById(@PathVariable Long orderId) {
        return orderRepository.findById(orderId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/orders/{orderId}/accept")
    public ResponseEntity<Order> acceptOrder(@PathVariable Long orderId, Principal principal) {
        User merchantUser = getAuthenticatedMerchant(principal);
        return ResponseEntity.ok(dispatchService.acceptOrder(orderId, merchantUser));
    }

    @PostMapping("/orders/{orderId}/ready-for-pickup")
    public ResponseEntity<Order> readyForPickup(@PathVariable Long orderId, Principal principal) {
        User merchantUser = getAuthenticatedMerchant(principal);
        return ResponseEntity.ok(dispatchService.markReadyForPickup(orderId, merchantUser));
    }

    @PostMapping("/orders/{orderId}/assign-delivery")
    public ResponseEntity<DeliveryAssignment> assignDelivery(
            @PathVariable Long orderId,
            @RequestBody Map<String, Long> payload,
            Principal principal) {
        User merchantUser = getAuthenticatedMerchant(principal);
        Long partnerId = payload.get("deliveryPartnerId");
        return ResponseEntity.ok(dispatchService.assignDeliveryPartner(orderId, partnerId, merchantUser));
    }

    @PostMapping("/orders/{orderId}/handover")
    public ResponseEntity<DeliveryAssignment> recordHandover(@PathVariable Long orderId, Principal principal) {
        User merchantUser = getAuthenticatedMerchant(principal);
        return ResponseEntity.ok(dispatchService.recordHandover(orderId, merchantUser));
    }

    @PostMapping("/orders/{orderId}/close")
    public ResponseEntity<Order> closeOrder(
            @PathVariable Long orderId,
            @RequestBody(required = false) Map<String, String> payload,
            Principal principal) {
        User merchantUser = getAuthenticatedMerchant(principal);
        String notes = payload != null ? payload.get("notes") : null;
        return ResponseEntity.ok(dispatchService.closeOrder(orderId, notes, merchantUser));
    }

    @PostMapping("/orders/{orderId}/cancel")
    public ResponseEntity<Order> cancelOrder(
            @PathVariable Long orderId,
            @RequestBody Map<String, String> payload,
            Principal principal) {
        User merchantUser = getAuthenticatedMerchant(principal);
        String reason = payload.getOrDefault("reason", "Cancelled by merchant partner.");
        return ResponseEntity.ok(dispatchService.cancelOrder(orderId, reason, merchantUser));
    }

    private User getAuthenticatedMerchant(Principal principal) {
        String email = principal != null ? principal.getName() : "merchant@edrisperfume.et";
        return userRepository.findByEmail(email).orElseThrow(() -> new SecurityException("Merchant user not found: " + email));
    }
}
