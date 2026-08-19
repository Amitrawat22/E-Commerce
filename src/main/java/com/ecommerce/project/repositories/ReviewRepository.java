package com.ecommerce.project.repositories;

import com.ecommerce.project.model.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Long> {
    List<Review> findByProductProductIdOrderByCreatedAtDesc(Long productId);
    Long countByProductProductId(Long productId);
}
