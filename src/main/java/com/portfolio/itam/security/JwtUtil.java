package com.portfolio.itam.security;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.Date;

@Component
public class JwtUtil {
    
    // Genera una clave secreta hiper-segura de forma automática al arrancar
    private static final Key key = Keys.secretKeyFor(SignatureAlgorithm.HS256);
    
    // El token durará exactamente 24 horas (en milisegundos)
    private static final long EXPIRE_DURATION = 24 * 60 * 60 * 1000; 

    // Método que "imprime" el pase VIP
    public String generateToken(String username, String role) {
        return Jwts.builder()
                .setSubject(username) // A quién le pertenece el pase
                .claim("role", role)  // Qué nivel de acceso tiene (Ej. Admin)
                .setIssuedAt(new Date()) // Cuándo se emitió
                .setExpiration(new Date(System.currentTimeMillis() + EXPIRE_DURATION)) // Cuándo caduca
                .signWith(key) // Firma criptográfica para que nadie lo pueda falsificar
                .compact();
    }
}