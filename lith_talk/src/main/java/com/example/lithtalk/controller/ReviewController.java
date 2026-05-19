package com.example.lithtalk.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import com.example.lithtalk.dto.ReviewRequest;
import com.example.lithtalk.entity.Review;
import com.example.lithtalk.service.ReviewService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/reviews")
public class ReviewController {

    private final ReviewService reviewService;

    public ReviewController(ReviewService reviewService) {
        this.reviewService = reviewService;
    }

    @GetMapping
    public Map<String, Object> getReviews(@RequestParam(required = false) Long userId) {
        System.out.println("Fetching reviews, userId=" + userId);

        List<Review> allReviews = reviewService.getAllReviews();
        Review myReview = null;

        if (userId != null) {
            Optional<Review> optionalReview = reviewService.getReviewByUserId(userId);
            if (optionalReview.isPresent()) {
                myReview = optionalReview.get();
                System.out.println("Found myReview: " + myReview);
            } else {
                System.out.println("No review found for user " + userId);
            }
        }

        Map<String, Object> response = new HashMap<>();
        response.put("reviews", allReviews);
        response.put("myReview", myReview);
        return response;
    }


    @PostMapping
    public Review submitReview(@RequestBody ReviewRequest request) {
        // userId is taken directly from request
        return reviewService.submitReview(request);
    }

    @PutMapping("/{id}")
    public Review editReview(@PathVariable Long id, @RequestBody ReviewRequest request) {
        return reviewService.editReview(id, request);
    }
    @DeleteMapping("/{id}")
    public Map<String, String> deleteReview(
            @PathVariable Long id,
            @RequestParam Long userId
    ) {
        reviewService.deleteReview(id, userId);

        Map<String, String> response = new HashMap<>();
        response.put("message", "Review deleted successfully");
        return response;
    }

    @GetMapping("/{id}")
    public Review getReviewById(@PathVariable Long id) {
        Optional<Review> optionalReview = reviewService.getReviewByUserId(id);
        return optionalReview.orElseThrow(() -> new RuntimeException("Review not found with id: " + id));
    }


}
