package com.portfolio.itam.model;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "assets")
public class Asset {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String serialNumber;
    private String status;
    private LocalDate purchaseDate;

    // Relación N:1.
    @ManyToOne
    @JoinColumn(name = "employee_id") // Esta es la Foreign Key (Clave Foránea) en PostgreSQL
    private Employee employee;

    public Asset() {
    }

    public Asset(String name, String serialNumber, String status, LocalDate purchaseDate) {
        this.name = name;
        this.serialNumber = serialNumber;
        this.status = status;
        this.purchaseDate = purchaseDate;
    }

    /*
        ---- GETTERS Y SETTERS ----
    */

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getSerialNumber() { return serialNumber; }
    public void setSerialNumber(String serialNumber) { this.serialNumber = serialNumber; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public LocalDate getPurchaseDate() { return purchaseDate; }
    public void setPurchaseDate(LocalDate purchaseDate) { this.purchaseDate = purchaseDate; }

    public Employee getEmployee() { return employee; }
    public void setEmployee(Employee employee) { this.employee = employee; }
}