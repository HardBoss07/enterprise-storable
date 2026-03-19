package dev.m4tt3o.storable.api.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

/**
 * Request DTO for changing a user's email address.
 */
public record ChangeEmailRequest(
    @NotBlank(message = "New email is required")
    @Email(message = "Invalid email format")
    String newEmail
) {}
