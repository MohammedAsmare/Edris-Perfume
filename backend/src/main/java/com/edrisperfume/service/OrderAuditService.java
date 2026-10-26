package com.edrisperfume.service;

import com.edrisperfume.domain.entity.Order;
import com.edrisperfume.domain.entity.OrderStatusHistory;
import com.edrisperfume.domain.entity.User;
import com.edrisperfume.repository.OrderStatusHistoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class OrderAuditService {

    private final OrderStatusHistoryRepository historyRepository;

    @Transactional(propagation = Propagation.MANDATORY)
    public void recordTransition(
            Order order,
            String fromOrderStatus,
            String toOrderStatus,
            String fromFulfillmentStatus,
            String toFulfillmentStatus,
            String action,
            User performedBy,
            String role,
            String notes) {

        OrderStatusHistory history = OrderStatusHistory.builder()
                .order(order)
                .fromOrderStatus(fromOrderStatus)
                .toOrderStatus(toOrderStatus)
                .fromFulfillmentStatus(fromFulfillmentStatus)
                .toFulfillmentStatus(toFulfillmentStatus)
                .action(action)
                .performedBy(performedBy)
                .performedByRole(role)
                .notes(notes)
                .build();

        historyRepository.save(history);
    }

    public List<OrderStatusHistory> getOrderTimeline(Long orderId) {
        return historyRepository.findByOrderIdOrderByTimestampDesc(orderId);
    }
}
