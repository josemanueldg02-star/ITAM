package com.portfolio.itam.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    // Aquí configuramos las reglas de quién entra y quién no
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            // 1. Permitimos CORS (para que React no sea bloqueado por estar en otro puerto)
            .cors(cors -> cors.configure(http))
            // 2. Desactivamos CSRF (una protección para webs tradicionales, nosotros usaremos JWT)
            .csrf(csrf -> csrf.disable())
            // 3. Reglas de rutas
            .authorizeHttpRequests(auth -> auth
                // Permitimos las rutas de autenticación que crearemos luego
                .requestMatchers("/api/auth/**").permitAll() 
                // TEMPORAL: Dejamos todo abierto para que puedas añadir el botón en React sin que te dé error 401
                .anyRequest().permitAll() 
            );
            
        return http.build();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authConfig) throws Exception {
        return authConfig.getAuthenticationManager();
    }
}