package dev.m4tt3o.storable.core.service;

import dev.m4tt3o.storable.common.dto.UserDto;
import dev.m4tt3o.storable.common.entity.UserRole;
import dev.m4tt3o.storable.core.domain.File;
import dev.m4tt3o.storable.core.domain.Storable;
import dev.m4tt3o.storable.core.domain.User;
import dev.m4tt3o.storable.core.port.FilePersistencePort;
import dev.m4tt3o.storable.core.port.UserPersistencePort;
import java.util.List;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service for administrative tasks like user management.
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class AdminService {

    private final UserPersistencePort userPersistencePort;
    private final FilePersistencePort filePersistencePort;
    private final StorageService storageService;

    private static final String ROOT_USER_ID =
        "f43c0bcf-11e4-4629-b072-321ccd04e72a";

    /**
     * Retrieves all users in the system.
     */
    @Transactional(readOnly = true)
    public List<UserDto> getAllUsers() {
        log.info("Fetching all users for administration.");
        return userPersistencePort
            .searchUsers("")
            .stream()
            .map(this::toUserDto)
            .toList();
    }

    /**
     * Updates the role of a user.
     */
    @Transactional
    public void updateUserRole(String userId, UserRole newRole) {
        log.info("Updating role for user {} to {}", userId, newRole);

        validateRoleUpdateTarget(userId);
        User user = findUserById(userId);

        User updatedUser = User.builder()
            .id(user.id())
            .username(user.username())
            .password(user.password())
            .email(user.email())
            .role(newRole)
            .build();

        userPersistencePort.save(updatedUser);
    }

    /**
     * Deletes a user and all their associated data.
     */
    @Transactional
    public void deleteUser(String userId) {
        log.info("Commencing deletion for user: {}", userId);

        validateDeletionTarget(userId);

        // 1. Fetch and clean physical files
        cleanUserPhysicalFiles(userId);

        // 2. Delete user entry
        userPersistencePort.deleteById(userId);

        log.info(
            "User {} and all associated data deleted successfully.",
            userId
        );
    }

    private User findUserById(String userId) {
        return userPersistencePort
            .findById(userId)
            .orElseThrow(() ->
                new RuntimeException("User not found: " + userId)
            );
    }

    private void cleanUserPhysicalFiles(String userId) {
        List<Storable> userNodes = filePersistencePort.findByOwnerId(userId);
        userNodes
            .stream()
            .filter(node -> node instanceof File f && f.storageKey() != null)
            .map(node -> (File) node)
            .forEach(this::deletePhysicalFile);
    }

    private void deletePhysicalFile(File file) {
        try {
            storageService.delete(file.storageKey());
        } catch (Exception e) {
            log.error(
                "Failed to delete physical file for storageKey {}: {}",
                file.storageKey(),
                e.getMessage()
            );
        }
    }

    private void validateRoleUpdateTarget(String userId) {
        if (ROOT_USER_ID.equals(userId)) {
            log.warn("Attempted to change the role of the root admin user!");
            throw new RuntimeException(
                "The root admin user's role cannot be changed."
            );
        }
    }

    private void validateDeletionTarget(String userId) {
        if (ROOT_USER_ID.equals(userId)) {
            log.warn("Attempted to delete the root admin user!");
            throw new RuntimeException(
                "The root admin user cannot be deleted."
            );
        }
    }

    private UserDto toUserDto(User user) {
        return new UserDto(
            user.id(),
            user.username(),
            user.email(),
            user.role()
        );
    }
}
