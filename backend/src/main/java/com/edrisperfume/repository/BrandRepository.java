package com.edrisperfume.repository;

import com.edrisperfume.domain.entity.Brand;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BrandRepository extends JpaRepository<Brand, Long> {
    Optional<Brand> findBySlug(String slug);
    List<Brand> findByIsActiveTrue();
    List<Brand> findByIsFeaturedTrue();
}
