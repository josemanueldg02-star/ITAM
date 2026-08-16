package com.portfolio.itam.controller;

// IMPORTS
import com.portfolio.itam.model.Asset;
import com.portfolio.itam.service.AssetService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Optional;

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

    @PutMapping("/{assetId}/assign/{employeeId}")
    public Asset assignAsset(@PathVariable Long assetId, @PathVariable Long employeeId) {
        return service.assignAssetToEmployee(assetId, employeeId);
    }

    // Endpoint para DESASIGNAR un equipo y cambiar su estado
    @PutMapping("/{assetId}/unassign")
    public ResponseEntity<Asset> unassignAsset(
            @PathVariable Long assetId,
            @RequestParam String newStatus) { 
        
        Optional<Asset> assetOptional = service.findById(assetId);
        
        if (assetOptional.isPresent()) {
            Asset asset = assetOptional.get();
            // Quitamos al empleado asignado (¡sin la palabra employee: !)
            asset.setEmployee(null);
            // Actualizamos el estado (DISPONIBLE o EN REPARACIÓN)
            asset.setStatus(newStatus);
            
            // Guardamos usando el servicio
            Asset updatedAsset = service.saveAsset(asset);
            return ResponseEntity.ok(updatedAsset);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    // Endpoint para cambiar el estado de un equipo (ej. Mandar a reparar)
    @PutMapping("/{assetId}/status")
    public ResponseEntity<Asset> changeStatus(
            @PathVariable Long assetId,
            @RequestParam String newStatus) { 
        try {
            // Usamos tu variable 'service' para llamar al nuevo método
            Asset updatedAsset = service.changeAssetStatus(assetId, newStatus);
            return ResponseEntity.ok(updatedAsset);
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }
}