package dev.m4tt3o.storable.core.service;

import dev.m4tt3o.storable.common.entity.UserRole;
import dev.m4tt3o.storable.core.domain.Folder;
import dev.m4tt3o.storable.core.domain.User;
import dev.m4tt3o.storable.core.dto.AuthRequest;
import dev.m4tt3o.storable.core.dto.AuthResponse;
import dev.m4tt3o.storable.core.dto.RegisterRequest;
import dev.m4tt3o.storable.core.exception.DuplicateResourceException;
import dev.m4tt3o.storable.core.exception.UnauthorizedAccessException;
import dev.m4tt3o.storable.core.port.FolderPersistencePort;
import dev.m4tt3o.storable.core.port.UserPersistencePort;
import dev.m4tt3o.storable.core.security.JwtService;
import java.util.ArrayList;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service for handling user authentication and registration.
 * Throws specific domain exceptions for proper API error reporting.
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserPersistencePort userPersistencePort;
    private final FolderPersistencePort folderPersistencePort;
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
                new UnauthorizedAccessException("Invalid username or password.")
            );

        if (!passwordEncoder.matches(request.password(), user.password())) {
            throw new UnauthorizedAccessException(
                "Invalid username or password."
            );
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
            throw new DuplicateResourceException(
                "Username already exists: " + request.username()
            );
        }
        if (userPersistencePort.existsByEmail(request.email())) {
            throw new DuplicateResourceException(
                "Email already exists: " + request.email()
            );
        }
    }

    private void createHomeDirectory(User user) {
        Folder homeDir = Folder.builder()
            .name(user.username())
            .ownerId(user.id())
            .parentId(1L) // The Root folder
            .children(new ArrayList<>())
            .build();

        folderPersistencePort.save(homeDir);
    }

    private String generateAuthToken(User user) {
        return jwtService.generateToken(
            user.username(),
            Map.of("role", user.role().name(), "id", user.id())
        );
    }
}
