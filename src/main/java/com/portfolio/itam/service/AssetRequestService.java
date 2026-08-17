package com.portfolio.itam.service;

import com.portfolio.itam.model.Asset;
import com.portfolio.itam.model.AssetRequest;
import com.portfolio.itam.model.Employee;
import com.portfolio.itam.repository.AssetRepository;
import com.portfolio.itam.repository.AssetRequestRepository;
import com.portfolio.itam.repository.EmployeeRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AssetRequestService {

    private final AssetRequestRepository requestRepository;
    private final AssetRepository assetRepository;
    private final EmployeeRepository employeeRepository;

    public AssetRequestService(AssetRequestRepository requestRepository, 
                               AssetRepository assetRepository, 
                               EmployeeRepository employeeRepository) {
        this.requestRepository = requestRepository;
        this.assetRepository = assetRepository;
        this.employeeRepository = employeeRepository;
    }

    // 1. Un empleado solicita un equipo
    public AssetRequest createRequest(Long assetId, Long employeeId) {
        Asset asset = assetRepository.findById(assetId)
                .orElseThrow(() -> new RuntimeException("Activo no encontrado"));
        Employee employee = employeeRepository.findById(employeeId)
                .orElseThrow(() -> new RuntimeException("Empleado no encontrado"));

        AssetRequest request = new AssetRequest(asset, employee);
        return requestRepository.save(request);
    }

    // 2. Obtener todas las peticiones (Para el Admin)
    public List<AssetRequest> getAllRequests() {
        return requestRepository.findAll();
    }

    // 3. Obtener peticiones de un empleado concreto (Para la vista de Usuario)
    public List<AssetRequest> getRequestsByEmployee(Long employeeId) {
        return requestRepository.findByEmployeeId(employeeId);
    }

    // 4. El Admin Aprueba o Rechaza la petición
    public AssetRequest updateRequestStatus(Long requestId, String newStatus) {
        AssetRequest request = requestRepository.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Petición no encontrada"));

        request.setStatus(newStatus); // "APROBADA" o "RECHAZADA"

        if ("APROBADA".equals(newStatus)) {
            Asset asset = request.getAsset();
            // Asignamos el equipo automáticamente al aprobar
            asset.setEmployee(request.getEmployee());
            asset.setStatus("ASIGNADO");
            assetRepository.save(asset); // Guardamos el activo actualizado
        }

        return requestRepository.save(request); // Guardamos la petición actualizada
    }
}