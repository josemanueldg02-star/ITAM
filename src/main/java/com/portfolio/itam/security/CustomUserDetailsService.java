package com.portfolio.itam.security;

import com.portfolio.itam.model.AppUser;
import com.portfolio.itam.repository.AppUserRepository;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    private final AppUserRepository userRepository;

    public CustomUserDetailsService(AppUserRepository userRepository) {
        this.userRepository = userRepository;
    }

    // Este es el método que usa Spring Security automáticamente cuando alguien intenta hacer Login
    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        // 1. Buscamos a tu usuario en PostgreSQL
        AppUser appUser = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("Usuario no encontrado en la base de datos"));

        // 2. Lo "traducimos" al formato que exige Spring Security
        return User.builder()
                .username(appUser.getUsername())
                .password(appUser.getPassword()) // Recordatorio: esto ya estará encriptado
                .roles(appUser.getRole().replace("ROLE_", "")) // Spring requiere que le quitemos el prefijo "ROLE_"
                .build();
    }
}