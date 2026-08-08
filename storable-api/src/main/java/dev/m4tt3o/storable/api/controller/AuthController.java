package dev.m4tt3o.storable.api.controller;

import dev.m4tt3o.storable.core.dto.AuthRequest;
import dev.m4tt3o.storable.core.dto.AuthResponse;
import dev.m4tt3o.storable.core.dto.RegisterRequest;
import dev.m4tt3o.storable.core.service.AuthService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Slf4j
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@RequestBody RegisterRequest request) {
        log.info("Received registration request for: {}", request.username());
        return ResponseEntity.ok(authService.register(request));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody AuthRequest request) {
        log.info("Received login request for: {}", request.username());
        return ResponseEntity.ok(authService.login(request));
    }
}
