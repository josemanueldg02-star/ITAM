package com.portfolio.itam.repository;

// IMPORTS
import com.portfolio.itam.model.Employee;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EmployeeRepository extends JpaRepository<Employee, Long> {

}