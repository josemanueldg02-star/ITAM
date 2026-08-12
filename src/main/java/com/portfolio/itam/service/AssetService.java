package com.portfolio.itam.service;

// IMPORTS
import com.portfolio.itam.model.Asset;
import com.portfolio.itam.repository.AssetRepository;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class AssetService {
    
    private final AssetRepository repository;

    // Inyección de dependencias a través del constructor.
    public AssetService(AssetRepository repository) {
        this.repository = repository;
    }

    // Método para obtener todos los activos.
    public List<Asset> getAllAssets() {
        return repository.findAll();
    }

    // Método para guardar un nuevo activo.
    public Asset saveAsset(Asset asset) {
        return repository.save(asset);
    }
}