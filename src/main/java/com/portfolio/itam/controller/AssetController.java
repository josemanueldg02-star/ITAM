package com.portfolio.itam.controller;

// IMPORTS
import com.portfolio.itam.model.Asset;
import com.portfolio.itam.service.AssetService;
import org.springframework.web.bind.annotation.*;
import java.util.List;


@RestController
@RequestMapping("/api/assets")
public class AssetController {
    
    private final AssetService service;

    public AssetController(AssetService service) {
        this.service = service;
    }

    // Petición GET: Para devolver la lista de activos.
    @GetMapping
    public List<Asset> getAll() {
        return service.getAllAssets();
    }

    // Petición POST
    @PostMapping
    public Asset create(@RequestBody Asset asset) {
        return service.saveAsset(asset);
    }
}