package com.portfolio.itam.config;

import com.portfolio.itam.model.AppUser;
import com.portfolio.itam.repository.AppUserRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class DataInitializer {

    // Extraemos los valores del application.properties
    @Value("${app.admin.username}")
    private String adminUsername;

    @Value("${app.admin.password}")
    private String adminPassword;

    @Bean
    public CommandLineRunner initData(AppUserRepository userRepository, PasswordEncoder passwordEncoder) {
        return args -> {
            // Buscamos si el admin ya existe. Si no existe, preparamos un usuario nuevo.
            AppUser admin = userRepository.findByUsername(adminUsername).orElse(new AppUser());
            
            admin.setUsername(adminUsername);
            // ¡Clave! Sobrescribimos la contraseña SIEMPRE con lo que haya en el properties
            admin.setPassword(passwordEncoder.encode(adminPassword)); 
            admin.setRole("ROLE_ADMIN");
            
            userRepository.save(admin);
            System.out.println("✅ Administrador sincronizado con éxito desde properties");
        };
    }
}