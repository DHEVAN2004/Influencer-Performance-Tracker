package com.influencer.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProfileVerificationResponse {
    private boolean verified;
    private String message;
    private String profileImageUrl;
    private Integer followers;
    private Double engagementRate;
    private String bio;
}
