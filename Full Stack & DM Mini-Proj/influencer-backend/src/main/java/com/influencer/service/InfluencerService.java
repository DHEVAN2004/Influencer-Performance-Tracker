package com.influencer.service;

import com.influencer.model.Influencer;
import com.influencer.repository.InfluencerRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class InfluencerService {

    private final InfluencerRepository influencerRepository;

    public List<Influencer> getAll() {
        return influencerRepository.findAll();
    }

    public Influencer getById(Long id) {
        return influencerRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Influencer not found: " + id));
    }

    public Influencer create(Influencer influencer) {
        return influencerRepository.save(influencer);
    }

    public Influencer update(Long id, Influencer updated) {
        Influencer existing = getById(id);
        updated.setId(existing.getId());
        return influencerRepository.save(updated);
    }

    public void delete(Long id) {
        influencerRepository.deleteById(id);
    }

    public List<Influencer> searchByName(String name) {
        return influencerRepository.findByNameContainingIgnoreCase(name);
    }

    public List<Influencer> filterByPlatform(String platform) {
        return influencerRepository.findByPlatform(platform);
    }

    public List<Influencer> filterByCategory(String category) {
        return influencerRepository.findByCategory(category);
    }

    public List<Influencer> filterByCountry(String country) {
        return influencerRepository.findByCountry(country);
    }
}
