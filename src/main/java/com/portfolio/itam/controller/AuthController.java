package com.portfolio.itam.controller;

import com.portfolio.itam.security.JwtUtil;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtUtil;

    public AuthController(AuthenticationManager authenticationManager, JwtUtil jwtUtil) {
        this.authenticationManager = authenticationManager;
        this.jwtUtil = jwtUtil;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> loginRequest) {
        try {
            String username = loginRequest.get("username");
            String password = loginRequest.get("password");

            // 1. Spring Security comprueba que el usuario y la contraseña coinciden
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(username, password)
            );

            // 2. Si es correcto, obtenemos los datos del usuario
            UserDetails userDetails = (UserDetails) authentication.getPrincipal();

            // 3. Fabricamos el "Pase VIP" (Token JWT)
            String role = userDetails.getAuthorities().iterator().next().getAuthority();
            String token = jwtUtil.generateToken(userDetails.getUsername(), role);

            // 4. Empaquetamos la respuesta para enviársela a React
            Map<String, String> response = new HashMap<>();
            response.put("token", token);
            response.put("username", userDetails.getUsername());
            response.put("role", role);

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            // Si la contraseña está mal, devolvemos un error 401 (No Autorizado)
            return ResponseEntity.status(401).body("Credenciales incorrectas");
        }
    }
}