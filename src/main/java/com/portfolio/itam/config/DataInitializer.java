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
            if (userRepository.count() == 0) {
                AppUser admin = new AppUser();
                // Usamos las variables en lugar del texto hardcodeado
                admin.setUsername(adminUsername);
                admin.setPassword(passwordEncoder.encode(adminPassword)); 
                admin.setRole("ROLE_ADMIN");
                
                userRepository.save(admin);
                System.out.println("✅ Administrador maestro creado con éxito desde properties");
            }
        };
    }
}