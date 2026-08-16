package com.portfolio.itam.config;

import com.portfolio.itam.model.AppUser;
import com.portfolio.itam.repository.AppUserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class DataInitializer {

    @Bean
    public CommandLineRunner initData(AppUserRepository userRepository, PasswordEncoder passwordEncoder) {
        return args -> {
            // Si la base de datos está vacía, sembramos nuestro primer usuario
            if (userRepository.count() == 0) {
                AppUser admin = new AppUser();
                admin.setUsername("admin");
                // ¡Magia! Encriptamos la contraseña antes de guardarla
                admin.setPassword(passwordEncoder.encode("admin123")); 
                admin.setRole("ROLE_ADMIN");
                
                userRepository.save(admin);
                System.out.println("✅ Administrador maestro creado con éxito (Usuario: admin | Contraseña: admin123)");
            }
        };
    }
}