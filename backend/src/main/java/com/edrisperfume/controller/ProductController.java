package com.edrisperfume.controller;

import com.edrisperfume.domain.entity.Brand;
import com.edrisperfume.domain.entity.Category;
import com.edrisperfume.domain.entity.Product;
import com.edrisperfume.repository.BrandRepository;
import com.edrisperfume.repository.CategoryRepository;
import com.edrisperfume.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1")
@RequiredArgsConstructor
public class ProductController {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final BrandRepository brandRepository;

    @GetMapping("/products")
    public ResponseEntity<List<Product>> getProducts() {
        return ResponseEntity.ok(productRepository.findByIsActiveTrue());
    }

    @GetMapping("/products/{slug}")
    public ResponseEntity<Product> getProductBySlug(@PathVariable String slug) {
        return productRepository.findBySlug(slug)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/categories")
    public ResponseEntity<List<Category>> getCategories() {
        return ResponseEntity.ok(categoryRepository.findByIsActiveTrueOrderByDisplayOrderAsc());
    }

    @GetMapping("/brands")
    public ResponseEntity<List<Brand>> getBrands() {
        return ResponseEntity.ok(brandRepository.findByIsActiveTrue());
    }
}
