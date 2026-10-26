package com.edrisperfume.domain.enums;

public enum PaymentStatus {
    PENDING,
    INITIATED,
    AWAITING_CUSTOMER_ACTION,
    PROCESSING,
    SUCCEEDED,
    FAILED,
    CANCELLED,
    EXPIRED,
    REFUND_PENDING,
    PARTIALLY_REFUNDED,
    REFUNDED
}
