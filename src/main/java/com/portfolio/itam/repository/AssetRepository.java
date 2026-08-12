package com.portfolio.itam.repository;

// iMPORTS
import com.portfolio.itam.model.Asset;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AssetRepository extends JpaRepository<Asset, Long> {
    
}
