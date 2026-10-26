package com.edrisperfume.controller;

import com.edrisperfume.domain.entity.User;
import com.edrisperfume.domain.enums.Role;
import com.edrisperfume.repository.UserRepository;
import com.edrisperfume.security.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider tokenProvider;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        String password = request.get("password");

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(email, password)
        );

        String jwt = tokenProvider.generateToken(authentication);
        User user = userRepository.findByEmail(email).orElseThrow();

        return ResponseEntity.ok(Map.of(
                "token", jwt,
                "user", Map.of(
                        "id", user.getId(),
                        "email", user.getEmail(),
                        "firstName", user.getFirstName(),
                        "lastName", user.getLastName(),
                        "role", user.getRole().name()
                )
        ));
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        if (userRepository.existsByEmail(email)) {
            return ResponseEntity.badRequest().body(Map.of("message", "Email is already registered."));
        }

        User user = User.builder()
                .email(email)
                .passwordHash(passwordEncoder.encode(request.get("password")))
                .firstName(request.get("firstName"))
                .lastName(request.get("lastName"))
                .phoneNumber(request.get("phone"))
                .role(Role.ROLE_CUSTOMER)
                .build();

        userRepository.save(user);
        return ResponseEntity.ok(Map.of("message", "User registered successfully."));
    }
}
