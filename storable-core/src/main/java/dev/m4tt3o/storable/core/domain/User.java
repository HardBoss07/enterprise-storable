package dev.m4tt3o.storable.core.domain;

import dev.m4tt3o.storable.common.entity.UserRole;
import lombok.Builder;

/**
 * Pure Java Domain Model for User, implemented as a Record.
 * This is the 'Source of Truth' for all modules.
 */
@Builder
public record User(
    String id,
    String username,
    String password,
    String email,
    UserRole role
) {}
