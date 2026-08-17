package com.portfolio.itam.controller;

import com.portfolio.itam.model.AssetRequest;
import com.portfolio.itam.service.AssetRequestService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/requests")
public class AssetRequestController {

    private final AssetRequestService requestService;

    public AssetRequestController(AssetRequestService requestService) {
        this.requestService = requestService;
    }

    // Endpoint para crear una petición (El Frontend enviará el assetId y employeeId)
    @PostMapping
    public ResponseEntity<AssetRequest> createRequest(@RequestBody Map<String, Long> payload) {
        Long assetId = payload.get("assetId");
        Long employeeId = payload.get("employeeId");
        
        AssetRequest newRequest = requestService.createRequest(assetId, employeeId);
        return ResponseEntity.ok(newRequest);
    }

    // Endpoint para ver todas las peticiones (Vista Admin)
    @GetMapping
    public List<AssetRequest> getAllRequests() {
        return requestService.getAllRequests();
    }

    // Endpoint para ver las peticiones de un empleado (Vista Usuario)
    @GetMapping("/employee/{employeeId}")
    public List<AssetRequest> getEmployeeRequests(@PathVariable Long employeeId) {
        return requestService.getRequestsByEmployee(employeeId);
    }

    // Endpoint para Aprobar o Rechazar
    @PutMapping("/{requestId}/status")
    public ResponseEntity<AssetRequest> updateStatus(
            @PathVariable Long requestId, 
            @RequestParam String status) {
        
        AssetRequest updatedRequest = requestService.updateRequestStatus(requestId, status);
        return ResponseEntity.ok(updatedRequest);
    }
}