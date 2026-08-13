package com.portfolio.itam.service;

// IMPORTS
import com.portfolio.itam.model.Asset;
import com.portfolio.itam.repository.AssetRepository;
import com.portfolio.itam.repository.EmployeeRepository;
import com.portfolio.itam.model.Employee;
import org.springframework.stereotype.Service;
import java.util.List;

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
}