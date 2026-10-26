package com.edrisperfume.repository;

import com.edrisperfume.domain.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
    Optional<Product> findBySlug(String slug);
    List<Product> findByIsActiveTrue();
    List<Product> findByMerchantId(Long merchantId);
    List<Product> findByCategoryId(Long categoryId);
}
