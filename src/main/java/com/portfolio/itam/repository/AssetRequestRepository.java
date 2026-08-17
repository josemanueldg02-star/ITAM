package com.portfolio.itam.repository;

import com.portfolio.itam.model.AssetRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface AssetRequestRepository extends JpaRepository<AssetRequest, Long> {
    
    // 1. Para que un empleado vea solo sus propias peticiones
    List<AssetRequest> findByEmployeeId(Long employeeId);
    
    // 2. Para que el Administrador pueda filtrar solo las peticiones pendientes
    List<AssetRequest> findByStatus(String status);
}