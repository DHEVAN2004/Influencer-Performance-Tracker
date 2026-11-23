package com.influencer.model;

import lombok.Data;
import jakarta.persistence.*;
import java.util.List;

@Data
@Entity
@Table(name = "influencers")
public class Influencer {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    private String platform;
    private long followers;
    private double engagementRate;
    private String bio;
    private String profileImage;
    private String country;
    private String category;
    private int avgPostsPerWeek;
    private String contactEmail;
    private String profileUrl;
    private boolean verified;
    private boolean isActive;
    @ElementCollection
    private List<GrowthData> growthData;

    @Embeddable
    @Data
    public static class GrowthData {
        private String date;
        private long followers;
    }
}
