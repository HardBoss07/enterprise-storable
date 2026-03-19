package dev.m4tt3o.storable.core.service;

import dev.m4tt3o.storable.common.entity.User;
import dev.m4tt3o.storable.common.repository.UserRepository;
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

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AdminService adminService;

    /**
     * Changes a user's password after verifying the current one.
     * @param userId The UUID of the user.
     * @param currentPassword The current password to verify.
     * @param newPassword The new password to set.
     */
    @Transactional
    public void changePassword(
        String userId,
        String currentPassword,
        String newPassword
    ) {
        log.info("Changing password for user: {}", userId);

        User user = userRepository
            .findById(userId)
            .orElseThrow(() -> new RuntimeException("User not found"));

        if (!passwordEncoder.matches(currentPassword, user.getPassword())) {
            throw new RuntimeException("Incorrect current password");
        }

        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);
        log.info("Password changed successfully for user: {}", userId);
    }

    /**
     * Updates a user's email address.
     * @param userId The UUID of the user.
     * @param newEmail The new email to set.
     */
    @Transactional
    public void changeEmail(String userId, String newEmail) {
        log.info("Changing email for user: {} to {}", userId, newEmail);

        if (userRepository.existsByEmail(newEmail)) {
            throw new RuntimeException("Email already exists");
        }

        User user = userRepository
            .findById(userId)
            .orElseThrow(() -> new RuntimeException("User not found"));

        user.setEmail(newEmail);
        userRepository.save(user);
        log.info("Email changed successfully for user: {}", userId);
    }

    /**
     * Deletes a user's account after confirming their password.
     * @param userId The UUID of the user.
     * @param passwordConfirmation The password to confirm.
     */
    @Transactional
    public void deleteAccount(String userId, String passwordConfirmation) {
        log.info("Processing account deletion request for user: {}", userId);

        if ("f43c0bcf-11e4-4629-b072-321ccd04e72a".equals(userId)) {
            log.warn("Attempted to delete the root admin user!");
            throw new RuntimeException(
                "The root admin user cannot be deleted."
            );
        }

        User user = userRepository
            .findById(userId)
            .orElseThrow(() -> new RuntimeException("User not found"));

        if (
            !passwordEncoder.matches(passwordConfirmation, user.getPassword())
        ) {
            throw new RuntimeException(
                "Incorrect password for account deletion confirmation"
            );
        }

        // Delegate deletion logic to AdminService (it already handles full cleanup)
        adminService.deleteUser(userId);
        log.info("Account for user {} has been permanently deleted.", userId);
    }
}
