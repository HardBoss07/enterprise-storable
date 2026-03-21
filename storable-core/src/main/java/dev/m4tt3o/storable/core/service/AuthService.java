package dev.m4tt3o.storable.core.service;

import dev.m4tt3o.storable.common.entity.FileNode;
import dev.m4tt3o.storable.common.entity.UserRole;
import dev.m4tt3o.storable.common.repository.FileNodeRepository;
import dev.m4tt3o.storable.core.domain.User;
import dev.m4tt3o.storable.core.dto.AuthRequest;
import dev.m4tt3o.storable.core.dto.AuthResponse;
import dev.m4tt3o.storable.core.dto.RegisterRequest;
import dev.m4tt3o.storable.core.port.UserPersistencePort;
import dev.m4tt3o.storable.core.security.JwtService;
import java.util.Map;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service for handling user authentication and registration.
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserPersistencePort userPersistencePort;
    private final FileNodeRepository fileNodeRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    /**
     * Registers a new user and creates their home directory.
     */
    @Transactional
    public AuthResponse register(RegisterRequest request) {
        log.info("Registering user: {}", request.username());

        validateUserRegistration(request);

        User user = User.builder()
            .username(request.username())
            .email(request.email())
            .password(passwordEncoder.encode(request.password()))
            .role(UserRole.USER)
            .build();

        User savedUser = userPersistencePort.save(user);
        createHomeDirectory(savedUser);

        String token = generateAuthToken(savedUser);

        return new AuthResponse(
            token,
            savedUser.username(),
            savedUser.email(),
            savedUser.id(),
            savedUser.role().name()
        );
    }

    /**
     * Authenticates a user and returns an auth response with a JWT.
     */
    public AuthResponse login(AuthRequest request) {
        log.info("Logging in user: {}", request.username());

        User user = userPersistencePort
            .findByUsername(request.username())
            .orElseThrow(() ->
                new RuntimeException("Invalid username or password")
            );

        if (!passwordEncoder.matches(request.password(), user.password())) {
            throw new RuntimeException("Invalid username or password");
        }

        String token = generateAuthToken(user);

        return new AuthResponse(
            token,
            user.username(),
            user.email(),
            user.id(),
            user.role().name()
        );
    }

    private void validateUserRegistration(RegisterRequest request) {
        if (userPersistencePort.existsByUsername(request.username())) {
            throw new RuntimeException("Username already exists");
        }
        if (userPersistencePort.existsByEmail(request.email())) {
            throw new RuntimeException("Email already exists");
        }
    }

    private void createHomeDirectory(User user) {
        FileNode homeDir = new FileNode();
        homeDir.setName(user.username());
        homeDir.setOwnerId(user.id());
        homeDir.setParentId(1L); // The Root folder
        homeDir.setKind(FileNode.NodeKind.folder);
        homeDir.setMime("directory");
        homeDir.setStorageKey(UUID.randomUUID().toString());

        fileNodeRepository.save(homeDir);
    }

    private String generateAuthToken(User user) {
        return jwtService.generateToken(
            user.username(),
            Map.of("role", user.role().name(), "id", user.id())
        );
    }
}
