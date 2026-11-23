package com.influencer.controller;

import com.influencer.dto.ProfileVerificationRequest;
import com.influencer.dto.ProfileVerificationResponse;
import com.influencer.model.Influencer;
import com.influencer.service.InfluencerService;
import com.influencer.service.ProfileVerificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.annotation.CrossOrigin;

import java.util.List;

@RestController
@RequestMapping("/api/influencers")
@CrossOrigin(origins = {"http://localhost:5173", "http://127.0.0.1:5173"})
@RequiredArgsConstructor
public class InfluencerController {

    private final InfluencerService influencerService;
    private final ProfileVerificationService profileVerificationService;

    @GetMapping
    public ResponseEntity<List<Influencer>> getAll(
            @RequestParam(required = false) String name,
            @RequestParam(required = false) String platform,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String country) {

        if (name != null) return ResponseEntity.ok(influencerService.searchByName(name));
        if (platform != null) return ResponseEntity.ok(influencerService.filterByPlatform(platform));
        if (category != null) return ResponseEntity.ok(influencerService.filterByCategory(category));
        if (country != null) return ResponseEntity.ok(influencerService.filterByCountry(country));
        return ResponseEntity.ok(influencerService.getAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Influencer> getById(@PathVariable Long id) {
        return ResponseEntity.ok(influencerService.getById(id));
    }

    @PostMapping
    public ResponseEntity<Influencer> create(@RequestBody Influencer influencer) {
        return ResponseEntity.ok(influencerService.create(influencer));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Influencer> update(@PathVariable Long id, @RequestBody Influencer influencer) {
        return ResponseEntity.ok(influencerService.update(id, influencer));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        influencerService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/verify-profile")
    public ResponseEntity<ProfileVerificationResponse> verifyProfile(@RequestBody ProfileVerificationRequest request) {
        ProfileVerificationResponse response = profileVerificationService.verifyProfile(request);
        return ResponseEntity.ok(response);
    }
}