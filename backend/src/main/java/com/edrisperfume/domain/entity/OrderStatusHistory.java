package com.edrisperfume.domain.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "order_status_history")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderStatusHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id", nullable = false)
    private Order order;

    @Column(name = "from_order_status", length = 40)
    private String fromOrderStatus;

    @Column(name = "to_order_status", nullable = false, length = 40)
    private String toOrderStatus;

    @Column(name = "from_fulfillment_status", length = 40)
    private String fromFulfillmentStatus;

    @Column(name = "to_fulfillment_status", nullable = false, length = 40)
    private String toFulfillmentStatus;

    @Column(nullable = false, length = 80)
    private String action;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "performed_by_id")
    private User performedBy;

    @Column(name = "performed_by_role", nullable = false, length = 40)
    private String performedByRole;

    @Column(columnDefinition = "TEXT")
    private String notes;

    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private LocalDateTime timestamp;
}
