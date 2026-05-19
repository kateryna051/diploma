package com.example.lithtalk.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.example.lithtalk.dto.ReviewRequest;
import com.example.lithtalk.entity.Review;
import com.example.lithtalk.repository.ReviewRepository;

@Service
public class ReviewService {

    private final ReviewRepository reviewRepository;

    public ReviewService(ReviewRepository reviewRepository) {
        this.reviewRepository = reviewRepository;
    }

    public List<Review> getAllReviews() {
        return reviewRepository.findAllByOrderByCreatedAtDesc();
    }

    public Review submitReview(ReviewRequest request) {
        Review review = new Review();
        review.setUserId(request.getUserId());
        review.setRating(request.getRating());
        review.setComment(request.getComment());
        review.setName(request.getName());
        review.setCreatedAt(LocalDateTime.now());
        return reviewRepository.save(review);
    }

    public Review editReview(Long reviewId, ReviewRequest request) {
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new IllegalArgumentException("Review not found"));

        // Optional: only allow editing if the userId matches
        if (!review.getUserId().equals(request.getUserId())) {
            throw new IllegalArgumentException("Cannot edit someone else's review");
        }

        review.setRating(request.getRating());
        review.setComment(request.getComment());
        review.setUpdatedAt(LocalDateTime.now());
        return reviewRepository.save(review);
    }

    public void deleteReview(Long reviewId, Long userId) {
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new IllegalArgumentException("Review not found"));

        // Allow deleting only your own review
        if (!review.getUserId().equals(userId)) {
            throw new IllegalArgumentException("Cannot delete someone else's review");
        }

        reviewRepository.delete(review);
    }


    public Optional<Review> getReviewByUserId(Long userId) {
        if (userId == null) return Optional.empty();
        return reviewRepository.findByUserId(userId);
    }

}
