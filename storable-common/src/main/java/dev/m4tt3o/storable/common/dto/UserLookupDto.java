package dev.m4tt3o.storable.common.dto;

import dev.m4tt3o.storable.common.entity.UserRole;

/**
 * Data Transfer Object for public user lookup (e.g., for sharing).
 */
public record UserLookupDto(
    String id,
    String username,
    String email
) {}
