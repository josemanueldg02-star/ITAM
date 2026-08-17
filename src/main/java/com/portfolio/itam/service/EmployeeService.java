package com.portfolio.itam.service;

import com.portfolio.itam.model.Employee;
import com.portfolio.itam.model.AppUser;
import com.portfolio.itam.repository.EmployeeRepository;
import com.portfolio.itam.repository.AppUserRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class EmployeeService {

    private final EmployeeRepository employeeRepository;
    private final AppUserRepository appUserRepository;
    private final PasswordEncoder passwordEncoder;

    // Extraemos la contraseña segura desde el properties
    @Value("${app.default.user.password}")
    private String defaultPassword;

    public EmployeeService(EmployeeRepository employeeRepository, 
                           AppUserRepository appUserRepository, 
                           PasswordEncoder passwordEncoder) {
        this.employeeRepository = employeeRepository;
        this.appUserRepository = appUserRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public List<Employee> getAllEmployees() {
        return employeeRepository.findAll();
    }

    public Optional<Employee> findById(Long id) {
        return employeeRepository.findById(id);
    }

    public Employee saveEmployee(Employee employee) {
        
        Employee savedEmployee = employeeRepository.save(employee);

        String username = (employee.getEmail() != null && !employee.getEmail().isEmpty()) 
                ? employee.getEmail() 
                : employee.getName().toLowerCase().replace(" ", ".") + savedEmployee.getId();

        if (appUserRepository.findByUsername(username).isEmpty()) {
            
            AppUser newUser = new AppUser();
            newUser.setUsername(username);
            
            // Usamos la variable de entorno, cero hardcodeo. ¡Código seguro!
            newUser.setPassword(passwordEncoder.encode(defaultPassword));
            newUser.setRole("ROLE_USER"); 

            appUserRepository.save(newUser);
            System.out.println("✅ Cuenta de acceso generada para: " + username);
        }

        return savedEmployee;
    }
}