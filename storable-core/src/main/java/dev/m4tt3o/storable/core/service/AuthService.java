package dev.m4tt3o.storable.core.service;

import dev.m4tt3o.storable.core.dto.AuthRequest;
import dev.m4tt3o.storable.core.dto.AuthResponse;
import dev.m4tt3o.storable.core.dto.RegisterRequest;
import dev.m4tt3o.storable.core.security.JwtService;
import dev.m4tt3o.storable.common.entity.FileNode;
import dev.m4tt3o.storable.common.entity.User;
import dev.m4tt3o.storable.common.entity.UserRole;
import dev.m4tt3o.storable.common.repository.FileNodeRepository;
import dev.m4tt3o.storable.common.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Map;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final FileNodeRepository fileNodeRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        log.info("Registering user: {}", request.username());
        
        if (userRepository.existsByUsername(request.username())) {
            throw new RuntimeException("Username already exists");
        }
        if (userRepository.existsByEmail(request.email())) {
            throw new RuntimeException("Email already exists");
        }

        User user = new User();
        user.setUsername(request.username());
        user.setEmail(request.email());
        user.setPassword(passwordEncoder.encode(request.password()));
        user.setRole(UserRole.USER); // Default role

        User savedUser = userRepository.save(user);

        // Create Home Directory
        FileNode homeDir = new FileNode();
        homeDir.setName(savedUser.getUsername());
        homeDir.setOwnerId(savedUser.getId());
        homeDir.setParentId(1L); // The Root folder
        homeDir.setKind(FileNode.NodeKind.folder);
        homeDir.setMime("directory");
        homeDir.setStorageKey(UUID.randomUUID().toString());
        
        fileNodeRepository.save(homeDir);
        
        String token = jwtService.generateToken(savedUser.getUsername(), Map.of("role", savedUser.getRole().name(), "id", savedUser.getId()));
        
        return new AuthResponse(token, savedUser.getUsername(), savedUser.getEmail(), savedUser.getId(), savedUser.getRole().name());
    }

    public AuthResponse login(AuthRequest request) {
        log.info("Logging in user: {}", request.username());
        
        User user = userRepository.findByUsername(request.username())
                .orElseThrow(() -> new RuntimeException("Invalid username or password"));

        if (!passwordEncoder.matches(request.password(), user.getPassword())) {
            throw new RuntimeException("Invalid username or password");
        }

        String token = jwtService.generateToken(user.getUsername(), Map.of("role", user.getRole().name(), "id", user.getId()));
        
        return new AuthResponse(token, user.getUsername(), user.getEmail(), user.getId(), user.getRole().name());
    }
}
