package com.edrisperfume.repository;

import com.edrisperfume.domain.entity.DeliveryAssignment;
import com.edrisperfume.domain.enums.DeliveryAssignmentStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface DeliveryAssignmentRepository extends JpaRepository<DeliveryAssignment, Long> {
    Optional<DeliveryAssignment> findByOrderId(Long orderId);
    List<DeliveryAssignment> findByDeliveryPartnerId(Long deliveryPartnerId);
    List<DeliveryAssignment> findByDeliveryPartnerIdAndStatus(Long deliveryPartnerId, DeliveryAssignmentStatus status);
    List<DeliveryAssignment> findByMerchantId(Long merchantId);
}
