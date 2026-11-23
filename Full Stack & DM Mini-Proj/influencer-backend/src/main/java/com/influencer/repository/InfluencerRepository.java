package com.influencer.repository;

import com.influencer.model.Influencer;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface InfluencerRepository extends JpaRepository<Influencer, Long> {
    List<Influencer> findByPlatform(String platform);
    List<Influencer> findByCategory(String category);
    List<Influencer> findByCountry(String country);
    List<Influencer> findByNameContainingIgnoreCase(String name);
}
