package com.portfolio.itam.service;

// IMPORTS
import com.portfolio.itam.model.Asset;
import com.portfolio.itam.repository.AssetRepository;
import com.portfolio.itam.repository.EmployeeRepository;
import com.portfolio.itam.model.Employee;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional; // <-- NUEVO IMPORT NECESARIO

@Service
public class AssetService {
    
    private final AssetRepository assetRepository;
    private final EmployeeRepository employeeRepository;

    // Inyección de dependencias a través del constructor.
    public AssetService(AssetRepository assetRepository, EmployeeRepository employeeRepository) {
        this.assetRepository = assetRepository;
        this.employeeRepository = employeeRepository;
    }

    // Método para obtener todos los activos.
    public List<Asset> getAllAssets() {
        return assetRepository.findAll();
    }

    // Método para guardar un nuevo activo.
    public Asset saveAsset(Asset asset) {
        return assetRepository.save(asset);
    }

    // ---> ¡ESTA ES LA PIEZA QUE FALTABA! <---
    // Método para buscar un activo por su ID
    public Optional<Asset> findById(Long id) {
        return assetRepository.findById(id);
    }

    // Método para asignar un activo a un empleado.
    public Asset assignAssetToEmployee(Long assetId, Long employeeId) {
        // Búsqueda del activo y el empleado en la base de datos.
        Asset asset = assetRepository.findById(assetId)
        .orElseThrow(() -> new RuntimeException("Error: Activo no encontrado"));

        Employee employee = employeeRepository.findById(employeeId)
        .orElseThrow(() -> new RuntimeException("Error: Empleado no encontrado"));

        // Asignación y cambio de estado.
        asset.setEmployee(employee);
        asset.setStatus("ASIGNADO");

        // Guardado de cambios.
        return assetRepository.save(asset);
    }

    // Método para cambiar el estado (ej. Mandar a reparar)
    public Asset changeAssetStatus(Long assetId, String newStatus) {
        Asset asset = assetRepository.findById(assetId)
        .orElseThrow(() -> new RuntimeException("Error: Activo no encontrado"));

        // Si lo mandamos a reparar, por lógica de negocio, se lo quitamos al empleado
        if ("EN REPARACIÓN".equals(newStatus)) {
            asset.setEmployee(null);
        }
        
        asset.setStatus(newStatus);
        return assetRepository.save(asset);
    }
}