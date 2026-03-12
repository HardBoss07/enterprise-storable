package dev.m4tt3o.storable.common.dto;

import dev.m4tt3o.storable.common.entity.UserRole;

/**
 * DTO for user metadata.
 */
public record UserDto(
    String id,
    String username,
    String email,
    UserRole role
) {}
