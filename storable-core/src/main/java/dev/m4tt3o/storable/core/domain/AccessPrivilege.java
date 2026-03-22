package dev.m4tt3o.storable.core.domain;

import dev.m4tt3o.storable.common.entity.PrivilegeLevel;
import lombok.Builder;

/**
 * Pure Java Domain Model for an Access Privilege, implemented as a Record.
 */
@Builder
public record AccessPrivilege(
    Long id,
    Long nodeId,
    String userId,
    String username,
    String email,
    PrivilegeLevel level
) {}
