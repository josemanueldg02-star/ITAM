package com.portfolio.itam.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "asset_requests")
public class AssetRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Relación: Una petición pertenece a un activo específico
    @ManyToOne
    @JoinColumn(name = "asset_id", nullable = false)
    private Asset asset;

    // Relación: Una petición es hecha por un empleado específico
    @ManyToOne
    @JoinColumn(name = "employee_id", nullable = false)
    private Employee employee;

    // Estados posibles: "PENDIENTE", "APROBADA", "RECHAZADA"
    @Column(nullable = false)
    private String status = "PENDIENTE"; 

    @Column(nullable = false)
    private LocalDateTime requestDate;

    // Constructores
    public AssetRequest() {
        this.requestDate = LocalDateTime.now(); // Registra automáticamente la fecha actual
    }

    public AssetRequest(Asset asset, Employee employee) {
        this.asset = asset;
        this.employee = employee;
        this.status = "PENDIENTE";
        this.requestDate = LocalDateTime.now();
    }

    // Getters y Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Asset getAsset() { return asset; }
    public void setAsset(Asset asset) { this.asset = asset; }

    public Employee getEmployee() { return employee; }
    public void setEmployee(Employee employee) { this.employee = employee; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public LocalDateTime getRequestDate() { return requestDate; }
    public void setRequestDate(LocalDateTime requestDate) { this.requestDate = requestDate; }
}