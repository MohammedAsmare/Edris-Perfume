package com.edrisperfume.repository;

import com.edrisperfume.domain.entity.MerchantProfile;
import com.edrisperfume.domain.enums.MerchantApprovalStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface MerchantProfileRepository extends JpaRepository<MerchantProfile, Long> {
    Optional<MerchantProfile> findByUserId(Long userId);
    List<MerchantProfile> findByApprovalStatus(MerchantApprovalStatus status);
}
