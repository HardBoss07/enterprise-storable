package dev.m4tt3o.storable.core.service;

import dev.m4tt3o.storable.common.dto.UserDto;
import dev.m4tt3o.storable.common.entity.FileNode;
import dev.m4tt3o.storable.common.entity.User;
import dev.m4tt3o.storable.common.entity.UserRole;
import dev.m4tt3o.storable.common.repository.FileNodeRepository;
import dev.m4tt3o.storable.common.repository.UserRepository;
import java.util.List;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
@RequiredArgsConstructor
public class AdminService {

    private final UserRepository userRepository;
    private final FileNodeRepository fileNodeRepository;
    private final StorageService storageService;

    /**
     * Retrieves all users in the system.
     * @return List of UserDto.
     */
    @Transactional(readOnly = true)
    public List<UserDto> getAllUsers() {
        log.info("Fetching all users for administration.");
        return userRepository
            .findAll()
            .stream()
            .map(u ->
                new UserDto(
                    u.getId(),
                    u.getUsername(),
                    u.getEmail(),
                    u.getRole()
                )
            )
            .collect(Collectors.toList());
    }

    /**
     * Updates the role of a user.
     * @param userId The UUID of the user.
     * @param newRole The new role to assign.
     */
    @Transactional
    public void updateUserRole(String userId, UserRole newRole) {
        log.info("Updating role for user {} to {}", userId, newRole);

        if ("f43c0bcf-11e4-4629-b072-321ccd04e72a".equals(userId)) {
            log.warn("Attempted to change the role of the root admin user!");
            throw new RuntimeException(
                "The root admin user's role cannot be changed."
            );
        }

        User user = userRepository
            .findById(userId)
            .orElseThrow(() ->
                new RuntimeException("User not found: " + userId)
            );

        user.setRole(newRole);
        userRepository.save(user);
    }

    /**
     * Deletes a user and all their associated data (files, folders, DB records).
     * @param userId The UUID of the user to delete.
     */
    @Transactional
    public void deleteUser(String userId) {
        log.info("Commencing deletion for user: {}", userId);

        if ("f43c0bcf-11e4-4629-b072-321ccd04e72a".equals(userId)) {
            log.warn("Attempted to delete the root admin user!");
            throw new RuntimeException(
                "The root admin user cannot be deleted."
            );
        }

        // 1. Fetch all nodes owned by the user (needed for file cleanup)
        List<FileNode> userNodes = fileNodeRepository.findByOwnerId(userId);

        // 2. Delete physical files from disk for all 'file' kind nodes
        userNodes
            .stream()
            .filter(
                node ->
                    node.getKind() == FileNode.NodeKind.file &&
                    node.getStorageKey() != null
            )
            .forEach(node -> {
                try {
                    storageService.delete(node.getStorageKey());
                } catch (Exception e) {
                    log.error(
                        "Failed to delete physical file for storageKey {}: {}",
                        node.getStorageKey(),
                        e.getMessage()
                    );
                }
            });

        // 3. Delete user entry from DB
        // NOTE: The database schema has ON DELETE CASCADE for owner_id and parent_id,
        // so deleting the user will automatically remove all their nodes in the correct order.
        userRepository.deleteById(userId);

        log.info(
            "User {} and all associated data deleted successfully.",
            userId
        );
    }
}
