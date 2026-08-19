package com.ecommerce.project.controller;

import com.ecommerce.project.payload.ReviewDTO;
import com.ecommerce.project.service.ReviewService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class ReviewController {

    @Autowired
    private ReviewService reviewService;

    @GetMapping("/public/products/{productId}/reviews")
    public ResponseEntity<List<ReviewDTO>> getProductReviews(@PathVariable Long productId) {
        List<ReviewDTO> reviews = reviewService.getProductReviews(productId);
        return new ResponseEntity<>(reviews, HttpStatus.OK);
    }

    @PostMapping("/products/{productId}/reviews")
    public ResponseEntity<ReviewDTO> addReview(
            @PathVariable Long productId,
            @RequestBody Map<String, Object> payload) {

        String username = SecurityContextHolder.getContext().getAuthentication().getName();

        Integer rating = Integer.parseInt(payload.get("rating").toString());
        String title = payload.get("title").toString();
        String comment = payload.get("comment").toString();
        String userLocation = payload.containsKey("userLocation") && payload.get("userLocation") != null
                ? payload.get("userLocation").toString() : "Verified Buyer";

        ReviewDTO created = reviewService.addReview(productId, username, rating, title, comment, userLocation);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }
}
