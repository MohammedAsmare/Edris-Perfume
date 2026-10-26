package com.edrisperfume;

import com.edrisperfume.domain.entity.*;
import com.edrisperfume.domain.enums.*;
import com.edrisperfume.repository.*;
import com.edrisperfume.service.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class MerchantOrderDispatchTest {

    @Mock
    private OrderRepository orderRepository;
    @Mock
    private MerchantProfileRepository merchantProfileRepository;
    @Mock
    private DeliveryPartnerRepository deliveryPartnerRepository;
    @Mock
    private DeliveryAssignmentRepository deliveryAssignmentRepository;
    @Mock
    private OrderAuditService auditService;

    @InjectMocks
    private MerchantOrderDispatchService dispatchService;

    @InjectMocks
    private DeliveryPartnerService deliveryPartnerService;

    private User merchantUser;
    private User wrongMerchantUser;
    private User partnerUser;
    private User wrongPartnerUser;
    private MerchantProfile merchantProfile;
    private MerchantProfile wrongMerchantProfile;
    private DeliveryPartner deliveryPartner;
    private DeliveryPartner otherDeliveryPartner;
    private Order testOrder;
    private DeliveryAssignment testAssignment;

    @BeforeEach
    void setUp() {
        merchantUser = User.builder().id(2L).email("merchant@edrisperfume.et").role(Role.ROLE_MERCHANT).build();
        wrongMerchantUser = User.builder().id(22L).email("wrong@edrisperfume.et").role(Role.ROLE_MERCHANT).build();

        partnerUser = User.builder().id(4L).email("delivery@edrisperfume.et").role(Role.ROLE_DELIVERY_PARTNER).build();
        wrongPartnerUser = User.builder().id(44L).email("courier2@edrisperfume.et").role(Role.ROLE_DELIVERY_PARTNER).build();

        merchantProfile = MerchantProfile.builder().id(1L).user(merchantUser).businessName("Addis Luxury Scents").build();
        wrongMerchantProfile = MerchantProfile.builder().id(2L).user(wrongMerchantUser).businessName("Other Boutique").build();

        deliveryPartner = DeliveryPartner.builder()
                .id(1L)
                .user(partnerUser)
                .partnerName("Dawit Courier")
                .licensePlate("ET-AA-3-98211")
                .status("ACTIVE")
                .build();

        otherDeliveryPartner = DeliveryPartner.builder()
                .id(2L)
                .user(wrongPartnerUser)
                .partnerName("Other Courier")
                .licensePlate("ET-AA-3-55555")
                .status("ACTIVE")
                .build();

        testOrder = Order.builder()
                .id(100L)
                .orderNumber("EDR-2026-TEST")
                .shippingFullName("Selamawit Tadesse")
                .shippingPhone("+251911223344")
                .shippingCity("Addis Ababa")
                .shippingSubcity("Bole")
                .shippingAddressLine("House 42, Near Edna Mall")
                .totalAmount(new BigDecimal("14500.00"))
                .currency("ETB")
                .orderStatus(OrderStatus.PENDING_PAYMENT)
                .paymentStatus(PaymentStatus.SUCCEEDED)
                .fulfillmentStatus(FulfillmentStatus.UNFULFILLED)
                .items(new ArrayList<>())
                .build();

        OrderItem item = OrderItem.builder()
                .id(1L)
                .order(testOrder)
                .merchant(merchantProfile)
                .productName("Edris Royale Extrait")
                .quantity(1)
                .unitPrice(new BigDecimal("14500.00"))
                .subtotal(new BigDecimal("14500.00"))
                .build();
        testOrder.getItems().add(item);

        testAssignment = DeliveryAssignment.builder()
                .id(500L)
                .order(testOrder)
                .deliveryPartner(deliveryPartner)
                .merchant(merchantProfile)
                .status(DeliveryAssignmentStatus.ASSIGNED)
                .pickupAddress("Bole Medhanialem Arcade, Addis Ababa")
                .deliveryAddress("House 42, Near Edna Mall, Bole, Addis Ababa")
                .deliveryOtp("839214")
                .otpAttempts(0)
                .maxOtpAttempts(5)
                .recipientName("Selamawit Tadesse")
                .build();
    }

    @Test
    @DisplayName("Rule 2: Merchant accepts paid order, transitions to PROCESSING & PICKING")
    void testAcceptOrderSuccessful() {
        when(orderRepository.findById(100L)).thenReturn(Optional.of(testOrder));
        when(merchantProfileRepository.findByUserId(merchantUser.getId())).thenReturn(Optional.of(merchantProfile));
        when(orderRepository.save(any(Order.class))).thenAnswer(invocation -> invocation.getArgument(0));

        Order accepted = dispatchService.acceptOrder(100L, merchantUser);

        assertEquals(OrderStatus.PROCESSING, accepted.getOrderStatus());
        assertEquals(FulfillmentStatus.PICKING, accepted.getFulfillmentStatus());
        assertNotNull(accepted.getAcceptedAt());
        verify(auditService).recordTransition(any(), any(), eq("PROCESSING"), any(), eq("PICKING"), eq("ORDER_ACCEPTED"), eq(merchantUser), eq("ROLE_MERCHANT"), any());
    }

    @Test
    @DisplayName("Rule 10: Merchant cannot accept unpaid order without verified payment or COD")
    void testAcceptOrderFailsIfUnpaid() {
        testOrder.setPaymentStatus(PaymentStatus.PENDING);
        testOrder.setPaymentMethod("TELEBIRR");

        when(orderRepository.findById(100L)).thenReturn(Optional.of(testOrder));
        when(merchantProfileRepository.findByUserId(merchantUser.getId())).thenReturn(Optional.of(merchantProfile));

        IllegalStateException ex = assertThrows(IllegalStateException.class, () ->
                dispatchService.acceptOrder(100L, merchantUser)
        );
        assertTrue(ex.getMessage().contains("Payment is not verified"));
    }

    @Test
    @DisplayName("Rule 11: Merchant cannot accept or modify orders belonging to another boutique")
    void testWrongMerchantOwnershipRejected() {
        when(orderRepository.findById(100L)).thenReturn(Optional.of(testOrder));
        when(merchantProfileRepository.findByUserId(wrongMerchantUser.getId())).thenReturn(Optional.of(wrongMerchantProfile));

        SecurityException ex = assertThrows(SecurityException.class, () ->
                dispatchService.acceptOrder(100L, wrongMerchantUser)
        );
        assertTrue(ex.getMessage().contains("Unauthorized access"));
    }

    @Test
    @DisplayName("Merchant marks packed order ready for courier pickup")
    void testMarkReadyForPickup() {
        testOrder.setFulfillmentStatus(FulfillmentStatus.PICKING);
        when(orderRepository.findById(100L)).thenReturn(Optional.of(testOrder));
        when(merchantProfileRepository.findByUserId(merchantUser.getId())).thenReturn(Optional.of(merchantProfile));
        when(orderRepository.save(any(Order.class))).thenAnswer(invocation -> invocation.getArgument(0));

        Order packed = dispatchService.markReadyForPickup(100L, merchantUser);

        assertEquals(OrderStatus.READY_FOR_DISPATCH, packed.getOrderStatus());
        assertEquals(FulfillmentStatus.PACKED, packed.getFulfillmentStatus());
        assertNotNull(packed.getReadyPickupAt());
    }

    @Test
    @DisplayName("Rule 3: Merchant assigns delivery partner and generates 6-digit confirmation OTP")
    void testAssignDeliveryPartnerGeneratesOtp() {
        when(orderRepository.findById(100L)).thenReturn(Optional.of(testOrder));
        when(merchantProfileRepository.findByUserId(merchantUser.getId())).thenReturn(Optional.of(merchantProfile));
        when(deliveryPartnerRepository.findById(1L)).thenReturn(Optional.of(deliveryPartner));
        when(deliveryAssignmentRepository.findByOrderId(100L)).thenReturn(Optional.empty());
        when(deliveryAssignmentRepository.save(any(DeliveryAssignment.class))).thenAnswer(invocation -> invocation.getArgument(0));
        when(orderRepository.save(any(Order.class))).thenAnswer(invocation -> invocation.getArgument(0));

        DeliveryAssignment assignment = dispatchService.assignDeliveryPartner(100L, 1L, merchantUser);

        assertNotNull(assignment);
        assertEquals(DeliveryAssignmentStatus.ASSIGNED, assignment.getStatus());
        assertNotNull(assignment.getDeliveryOtp());
        assertEquals(6, assignment.getDeliveryOtp().length());
        assertEquals(assignment.getDeliveryOtp(), testOrder.getDeliveryOtp());
    }

    @Test
    @DisplayName("Rule 4 & 5: Courier confirms pickup and starts delivery (IN_TRANSIT / SHIPPED)")
    void testCourierPickupAndStartDelivery() {
        when(deliveryAssignmentRepository.findById(500L)).thenReturn(Optional.of(testAssignment));
        when(deliveryPartnerRepository.findByUserId(partnerUser.getId())).thenReturn(Optional.of(deliveryPartner));
        when(deliveryAssignmentRepository.save(any(DeliveryAssignment.class))).thenAnswer(invocation -> invocation.getArgument(0));
        when(orderRepository.save(any(Order.class))).thenAnswer(invocation -> invocation.getArgument(0));

        // 1. Confirm Pickup
        DeliveryAssignment pickedUp = deliveryPartnerService.confirmPickup(500L, partnerUser);
        assertEquals(DeliveryAssignmentStatus.PICKED_UP, pickedUp.getStatus());
        assertNotNull(pickedUp.getPickupConfirmedAt());

        // 2. Start Delivery (In Transit)
        DeliveryAssignment inTransit = deliveryPartnerService.startDelivery(500L, partnerUser);
        assertEquals(DeliveryAssignmentStatus.IN_TRANSIT, inTransit.getStatus());
        assertNotNull(inTransit.getStartedAt());
        assertEquals(OrderStatus.SHIPPED, testOrder.getOrderStatus());
        assertEquals(FulfillmentStatus.DISPATCHED, testOrder.getFulfillmentStatus());
    }

    @Test
    @DisplayName("Rule 6: Courier confirms delivery using valid recipient OTP")
    void testConfirmDeliveryWithValidOtp() {
        testAssignment.setStatus(DeliveryAssignmentStatus.IN_TRANSIT);
        when(deliveryAssignmentRepository.findById(500L)).thenReturn(Optional.of(testAssignment));
        when(deliveryPartnerRepository.findByUserId(partnerUser.getId())).thenReturn(Optional.of(deliveryPartner));
        when(deliveryAssignmentRepository.save(any(DeliveryAssignment.class))).thenAnswer(invocation -> invocation.getArgument(0));
        when(orderRepository.save(any(Order.class))).thenAnswer(invocation -> invocation.getArgument(0));

        DeliveryAssignment delivered = deliveryPartnerService.confirmDelivery(
                500L, "839214", "Selamawit Tadesse", "Delivered to recipient in person.", partnerUser
        );

        assertEquals(DeliveryAssignmentStatus.DELIVERED, delivered.getStatus());
        assertNotNull(delivered.getDeliveredAt());
        assertNotNull(delivered.getProofCode());
        assertTrue(delivered.getProofCode().startsWith("PROOF-OTP-839214"));
        assertEquals(FulfillmentStatus.DELIVERED, testOrder.getFulfillmentStatus());
    }

    @Test
    @DisplayName("Invalid delivery OTP is rejected and increments attempt count")
    void testConfirmDeliveryFailsWithInvalidOtp() {
        testAssignment.setStatus(DeliveryAssignmentStatus.IN_TRANSIT);
        when(deliveryAssignmentRepository.findById(500L)).thenReturn(Optional.of(testAssignment));
        when(deliveryPartnerRepository.findByUserId(partnerUser.getId())).thenReturn(Optional.of(deliveryPartner));

        IllegalArgumentException ex = assertThrows(IllegalArgumentException.class, () ->
                deliveryPartnerService.confirmDelivery(500L, "000000", "Someone", "notes", partnerUser)
        );

        assertTrue(ex.getMessage().contains("Invalid customer delivery verification PIN"));
        assertEquals(1, testAssignment.getOtpAttempts());
    }

    @Test
    @DisplayName("Rule 12: Courier records failed delivery with mandatory reason")
    void testCourierFailDelivery() {
        testAssignment.setStatus(DeliveryAssignmentStatus.IN_TRANSIT);
        when(deliveryAssignmentRepository.findById(500L)).thenReturn(Optional.of(testAssignment));
        when(deliveryPartnerRepository.findByUserId(partnerUser.getId())).thenReturn(Optional.of(deliveryPartner));
        when(deliveryAssignmentRepository.save(any(DeliveryAssignment.class))).thenAnswer(invocation -> invocation.getArgument(0));
        when(orderRepository.save(any(Order.class))).thenAnswer(invocation -> invocation.getArgument(0));

        DeliveryAssignment failed = deliveryPartnerService.failDelivery(500L, "Recipient phone switched off; gate locked.", partnerUser);

        assertEquals(DeliveryAssignmentStatus.FAILED, failed.getStatus());
        assertEquals("Recipient phone switched off; gate locked.", failed.getFailureReason());
        assertNotNull(failed.getFailedAt());
        assertEquals(FulfillmentStatus.DELIVERY_FAILED, testOrder.getFulfillmentStatus());
    }

    @Test
    @DisplayName("Rule 8 & 12: Merchant CANNOT close order if delivery is not successfully confirmed")
    void testCloseOrderFailsIfDeliveryNotConfirmed() {
        // Still in transit
        testAssignment.setStatus(DeliveryAssignmentStatus.IN_TRANSIT);
        testOrder.setFulfillmentStatus(FulfillmentStatus.DISPATCHED);

        when(orderRepository.findById(100L)).thenReturn(Optional.of(testOrder));
        when(merchantProfileRepository.findByUserId(merchantUser.getId())).thenReturn(Optional.of(merchantProfile));
        when(deliveryAssignmentRepository.findByOrderId(100L)).thenReturn(Optional.of(testAssignment));

        IllegalStateException ex = assertThrows(IllegalStateException.class, () ->
                dispatchService.closeOrder(100L, "Closing", merchantUser)
        );
        assertTrue(ex.getMessage().contains("Cannot close order"));
    }

    @Test
    @DisplayName("Rule 8: Merchant successfully closes order after verified delivery confirmation")
    void testCloseOrderSuccessfulAfterDelivery() {
        testAssignment.setStatus(DeliveryAssignmentStatus.DELIVERED);
        testOrder.setFulfillmentStatus(FulfillmentStatus.DELIVERED);

        when(orderRepository.findById(100L)).thenReturn(Optional.of(testOrder));
        when(merchantProfileRepository.findByUserId(merchantUser.getId())).thenReturn(Optional.of(merchantProfile));
        when(deliveryAssignmentRepository.findByOrderId(100L)).thenReturn(Optional.of(testAssignment));
        when(orderRepository.save(any(Order.class))).thenAnswer(invocation -> invocation.getArgument(0));

        Order closed = dispatchService.closeOrder(100L, "Proof code verified.", merchantUser);

        assertEquals(OrderStatus.DELIVERED, closed.getOrderStatus());
        assertNotNull(closed.getClosedAt());
        assertEquals(merchantUser, closed.getClosedBy());
        verify(auditService).recordTransition(any(), any(), eq("DELIVERED"), any(), any(), eq("ORDER_CLOSED"), eq(merchantUser), eq("ROLE_MERCHANT"), any());
    }

    @Test
    @DisplayName("Rule 11: Other delivery partner cannot modify package assigned to Dawit")
    void testWrongDeliveryPartnerUnauthorized() {
        when(deliveryAssignmentRepository.findById(500L)).thenReturn(Optional.of(testAssignment));
        when(deliveryPartnerRepository.findByUserId(wrongPartnerUser.getId())).thenReturn(Optional.of(otherDeliveryPartner));

        SecurityException ex = assertThrows(SecurityException.class, () ->
                deliveryPartnerService.confirmPickup(500L, wrongPartnerUser)
        );
        assertTrue(ex.getMessage().contains("Unauthorized"));
    }
}
