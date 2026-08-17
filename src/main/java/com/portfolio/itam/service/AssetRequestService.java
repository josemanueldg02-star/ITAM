package com.portfolio.itam.service;

import com.portfolio.itam.model.Asset;
import com.portfolio.itam.model.AssetRequest;
import com.portfolio.itam.model.Employee;
import com.portfolio.itam.repository.AssetRepository;
import com.portfolio.itam.repository.AssetRequestRepository;
import com.portfolio.itam.repository.EmployeeRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AssetRequestService {

    // 1. Inicializamos el Logger (nuestro sistema de auditoría)
    private static final Logger logger = LoggerFactory.getLogger(AssetRequestService.class);

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

    public AssetRequest createRequest(Long assetId, Long employeeId) {
        Asset asset = assetRepository.findById(assetId)
                .orElseThrow(() -> new RuntimeException("Activo no encontrado"));
        Employee employee = employeeRepository.findById(employeeId)
                .orElseThrow(() -> new RuntimeException("Empleado no encontrado"));

        AssetRequest request = new AssetRequest(asset, employee);
        
        // 2. Registramos la acción con nivel INFO (Informativo)
        logger.info("AUDITORÍA - Petición Creada: El empleado '{}' (ID: {}) ha solicitado el activo '{}' (ID: {})", 
                employee.getName(), employee.getId(), asset.getName(), asset.getId());

        return requestRepository.save(request);
    }

    public List<AssetRequest> getAllRequests() {
        return requestRepository.findAll();
    }

    public List<AssetRequest> getRequestsByEmployee(Long employeeId) {
        return requestRepository.findByEmployeeId(employeeId);
    }

    public AssetRequest updateRequestStatus(Long requestId, String newStatus) {
        AssetRequest request = requestRepository.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Petición no encontrada"));

        request.setStatus(newStatus);

        if ("APROBADA".equals(newStatus)) {
            Asset asset = request.getAsset();
            asset.setEmployee(request.getEmployee());
            asset.setStatus("ASIGNADO");
            assetRepository.save(asset);
            
            // 3. Registramos acciones críticas con nivel WARN (Advertencia/Importante)
            logger.warn("AUDITORÍA - Seguridad: Administrador ha APROBADO la petición #{}. Activo '{}' asignado.", 
                    requestId, asset.getName());
        } else {
            logger.warn("AUDITORÍA - Seguridad: Administrador ha RECHAZADO la petición #{}.", requestId);
        }

        return requestRepository.save(request);
    }
}