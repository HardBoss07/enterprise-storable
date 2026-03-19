package dev.m4tt3o.storable.api.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

/**
 * Request DTO for changing a user's password.
 */
public record ChangePasswordRequest(
    @NotBlank(message = "Current password is required") String currentPassword,

    @NotBlank(message = "New password is required")
    @Size(min = 8, message = "New password must be at least 8 characters long")
    String newPassword
) {}
