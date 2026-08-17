package com.portfolio.itam.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

@Entity
@Table(name = "employees")
public class Employee {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // @NotBlank asegura que el campo no sea null ni esté lleno solo de espacios
    @NotBlank(message = "El nombre del empleado es obligatorio")
    private String name;

    @NotBlank(message = "El departamento es obligatorio")
    private String department;

    // @Email comprueba mediante expresiones regulares que el formato sea correcto (ej: texto@texto.com)
    @NotBlank(message = "El email es obligatorio")
    @Email(message = "El formato del email no es válido")
    @Column(unique = true)
    private String email;

    // Constructor vacío exigido por Hibernate
    public Employee() {
    }

    // Constructor con parámetros
    public Employee(String name, String department, String email) {
        this.name = name;
        this.department = department;
        this.email = email;
    }

    // --- GETTERS Y SETTERS ---

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDepartment() {
        return department;
    }

    public void setDepartment(String department) {
        this.department = department;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }
}