package com.portfolio.itam.repository;

import com.portfolio.itam.model.AppUser;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface AppUserRepository extends JpaRepository<AppUser, Long> {
    
    // Método mágico de Spring Data: Buscará automáticamente por la columna 'username'
    Optional<AppUser> findByUsername(String username);
}