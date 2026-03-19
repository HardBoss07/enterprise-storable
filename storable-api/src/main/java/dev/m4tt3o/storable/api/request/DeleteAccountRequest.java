package dev.m4tt3o.storable.api.request;

import jakarta.validation.constraints.NotBlank;

/**
 * Request DTO for confirming account deletion with a password.
 */
public record DeleteAccountRequest(
    @NotBlank(message = "Password confirmation is required") String password
) {}
