package dev.m4tt3o.storable.api.controller;

import dev.m4tt3o.storable.api.request.ChangeEmailRequest;
import dev.m4tt3o.storable.api.request.ChangePasswordRequest;
import dev.m4tt3o.storable.api.request.DeleteAccountRequest;
import dev.m4tt3o.storable.core.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

/**
 * REST controller for user profile and account management.
 */
@Slf4j
@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    /**
     * Updates the password for the current user.
     */
    @PatchMapping("/me/password")
    public ResponseEntity<Void> changePassword(
        @AuthenticationPrincipal String userId,
        @Valid @RequestBody ChangePasswordRequest request
    ) {
        log.info("Request to change password for user ID: {}", userId);
        userService.changePassword(
            userId,
            request.currentPassword(),
            request.newPassword()
        );
        return ResponseEntity.noContent().build();
    }

    /**
     * Updates the email address for the current user.
     */
    @PatchMapping("/me/email")
    public ResponseEntity<Void> changeEmail(
        @AuthenticationPrincipal String userId,
        @Valid @RequestBody ChangeEmailRequest request
    ) {
        log.info(
            "Request to change email to {} for user ID: {}",
            request.newEmail(),
            userId
        );
        userService.changeEmail(userId, request.newEmail());
        return ResponseEntity.noContent().build();
    }

    /**
     * Permanently deletes the current user's account and all associated data.
     */
    @DeleteMapping("/me")
    public ResponseEntity<Void> deleteAccount(
        @AuthenticationPrincipal String userId,
        @Valid @RequestBody DeleteAccountRequest request
    ) {
        log.info(
            "Nuclear Option: Request to PERMANENTLY delete account for user ID: {}",
            userId
        );
        userService.deleteAccount(userId, request.password());
        return ResponseEntity.noContent().build();
    }
}
