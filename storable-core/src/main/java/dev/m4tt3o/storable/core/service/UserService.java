package dev.m4tt3o.storable.core.service;

import dev.m4tt3o.storable.core.domain.User;
import dev.m4tt3o.storable.core.port.UserPersistencePort;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service for managing user profile and account lifecycle.
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class UserService {

    private final UserPersistencePort userPersistencePort;
    private final PasswordEncoder passwordEncoder;
    private final AdminService adminService;

    private static final String ROOT_USER_ID =
        "f43c0bcf-11e4-4629-b072-321ccd04e72a";

    /**
     * Changes a user's password after verifying the current one.
     */
    @Transactional
    public void changePassword(
        String userId,
        String currentPassword,
        String newPassword
    ) {
        log.info("Changing password for user: {}", userId);

        User user = findUserById(userId);
        validateCurrentPassword(user, currentPassword);

        User updatedUser = User.builder()
            .id(user.id())
            .username(user.username())
            .password(passwordEncoder.encode(newPassword))
            .email(user.email())
            .role(user.role())
            .build();

        userPersistencePort.save(updatedUser);
        log.info("Password changed successfully for user: {}", userId);
    }

    /**
     * Updates a user's email address.
     */
    @Transactional
    public void changeEmail(String userId, String newEmail) {
        log.info("Changing email for user: {} to {}", userId, newEmail);

        validateEmailAvailability(newEmail);
        User user = findUserById(userId);

        User updatedUser = User.builder()
            .id(user.id())
            .username(user.username())
            .password(user.password())
            .email(newEmail)
            .role(user.role())
            .build();

        userPersistencePort.save(updatedUser);
        log.info("Email changed successfully for user: {}", userId);
    }

    /**
     * Deletes a user's account after confirming their password.
     */
    @Transactional
    public void deleteAccount(String userId, String passwordConfirmation) {
        log.info("Processing account deletion request for user: {}", userId);

        validateDeletionTarget(userId);
        User user = findUserById(userId);
        validateCurrentPassword(user, passwordConfirmation);

        adminService.deleteUser(userId);
        log.info("Account for user {} has been permanently deleted.", userId);
    }

    private User findUserById(String userId) {
        return userPersistencePort
            .findById(userId)
            .orElseThrow(() -> new RuntimeException("User not found"));
    }

    private void validateCurrentPassword(User user, String password) {
        if (!passwordEncoder.matches(password, user.password())) {
            throw new RuntimeException("Incorrect current password");
        }
    }

    private void validateEmailAvailability(String email) {
        if (userPersistencePort.existsByEmail(email)) {
            throw new RuntimeException("Email already exists");
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
}
