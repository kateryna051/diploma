package com.example.lithtalk.dto;

import lombok.Data;

@Data
public class ReviewRequest {
    private int rating;
    private String comment;
    private Long userId;
    private String name;// pass user ID from frontend
}
