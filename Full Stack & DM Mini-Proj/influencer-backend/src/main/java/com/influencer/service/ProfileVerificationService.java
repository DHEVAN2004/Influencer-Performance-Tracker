package com.influencer.service;

import com.influencer.dto.ProfileVerificationRequest;
import com.influencer.dto.ProfileVerificationResponse;
import org.springframework.stereotype.Service;
import java.net.URL;
import java.util.Random;
import java.util.regex.Pattern;

@Service
public class ProfileVerificationService {

    private static final Pattern INSTAGRAM_PATTERN = Pattern.compile("(?:https?://)?(?:www\\.)?instagram\\.com/([a-zA-Z0-9_.]+)/?");
    private static final Pattern YOUTUBE_PATTERN = Pattern.compile("(?:https?://)?(?:www\\.)?youtube\\.com/@?([a-zA-Z0-9_-]+)/?");
    private static final Pattern TIKTOK_PATTERN = Pattern.compile("(?:https?://)?(?:www\\.)?tiktok\\.com/@?([a-zA-Z0-9_.]+)/?");
    private static final Pattern TWITTER_PATTERN = Pattern.compile("(?:https?://)?(?:www\\.)?(?:twitter\\.com|x\\.com)/([a-zA-Z0-9_]+)/?");
    private static final Pattern LINKEDIN_PATTERN = Pattern.compile("(?:https?://)?(?:www\\.)?linkedin\\.com/in/([a-zA-Z0-9-]+)/?");

    public ProfileVerificationResponse verifyProfile(ProfileVerificationRequest request) {
        try {
            // Validate URL format
            if (!isValidUrl(request.getProfileUrl())) {
                return new ProfileVerificationResponse(false, "Invalid URL format", null, null, null, null);
            }

            // Validate URL matches platform
            if (!isUrlMatchesPlatform(request.getProfileUrl(), request.getPlatform())) {
                return new ProfileVerificationResponse(false, 
                    "URL does not match the specified platform: " + request.getPlatform(), 
                    null, null, null, null);
            }

            // Extract username from URL
            String username = extractUsernameFromUrl(request.getProfileUrl(), request.getPlatform());
            if (username == null || username.isEmpty()) {
                return new ProfileVerificationResponse(false, "Could not extract username from URL", null, null, null, null);
            }

            // Simulate fetching real data from the platform
            // In production, you would integrate with official APIs (Instagram Graph API, YouTube Data API, etc.)
            ProfileVerificationResponse response = fetchMockProfileData(username, request.getPlatform());
            response.setVerified(true);
            response.setMessage("Influencer profile verified successfully");
            return response;

        } catch (Exception e) {
            return new ProfileVerificationResponse(false, "Verification failed: " + e.getMessage(), null, null, null, null);
        }
    }

    private boolean isValidUrl(String urlString) {
        try {
            new URL(urlString);
            return urlString.startsWith("http://") || urlString.startsWith("https://");
        } catch (Exception e) {
            return false;
        }
    }

    private boolean isUrlMatchesPlatform(String url, String platform) {
        url = url.toLowerCase();
        switch (platform.toLowerCase()) {
            case "instagram":
                return url.contains("instagram.com");
            case "youtube":
                return url.contains("youtube.com");
            case "tiktok":
                return url.contains("tiktok.com");
            case "twitter":
                return url.contains("twitter.com") || url.contains("x.com");
            case "linkedin":
                return url.contains("linkedin.com");
            default:
                return false;
        }
    }

    private String extractUsernameFromUrl(String url, String platform) {
        switch (platform.toLowerCase()) {
            case "instagram":
                return extractWithPattern(url, INSTAGRAM_PATTERN);
            case "youtube":
                return extractWithPattern(url, YOUTUBE_PATTERN);
            case "tiktok":
                return extractWithPattern(url, TIKTOK_PATTERN);
            case "twitter":
                return extractWithPattern(url, TWITTER_PATTERN);
            case "linkedin":
                return extractWithPattern(url, LINKEDIN_PATTERN);
            default:
                return null;
        }
    }

    private String extractWithPattern(String url, Pattern pattern) {
        var matcher = pattern.matcher(url);
        if (matcher.find()) {
            return matcher.group(1);
        }
        return null;
    }

    private ProfileVerificationResponse fetchMockProfileData(String username, String platform) {
        // Simulate real data from different platforms
        // In production, integrate with actual APIs
        Random random = new Random();
        
        int followers = 50000 + random.nextInt(500000); // 50k - 550k followers
        double engagementRate = 2.0 + (random.nextDouble() * 8.0); // 2% - 10% engagement
        
        String bio = generateBioForPlatform(platform);
        String profileImage = "https://i.pravatar.cc/150?img=" + (1 + random.nextInt(70));

        return new ProfileVerificationResponse(
            false, // will be set to true in main method
            null,
            profileImage,
            followers,
            Math.round(engagementRate * 100.0) / 100.0,
            bio
        );
    }

    private String generateBioForPlatform(String platform) {
        switch (platform.toLowerCase()) {
            case "instagram":
                return "Content creator | Lifestyle & Fashion | Collaborations welcome 📸";
            case "youtube":
                return "Welcome to my channel! I share reviews, tutorials, and lifestyle content.";
            case "tiktok":
                return "Trending creator | Entertainment & Comedy | Follow for daily content 🎬";
            case "twitter":
                return "Digital enthusiast | Sharing thoughts on tech & culture 💬";
            case "linkedin":
                return "Professional | Industry expert | Sharing insights & experiences";
            default:
                return "Active content creator on this platform";
        }
    }

    public Object getProfileActivities(String profileUrl, String platform) {
        // Mock method to fetch and analyze activities
        // In production: fetch real data from platform APIs
        return new Object() {
            public final String status = "Profile verification required";
            public final int recentPosts = 0;
            public final double averageEngagement = 0.0;
            public final String lastActivityDate = "N/A";
        };
    }
}
