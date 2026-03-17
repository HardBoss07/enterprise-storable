package dev.m4tt3o.storable.common.dto;

import dev.m4tt3o.storable.common.entity.AccessPrivilege.PrivilegeLevel;

/**
 * Data Transfer Object for access privilege info.
 */
public record AccessPrivilegeDto(
    Long id,
    Long nodeId,
    String userId,
    String username,
    String email,
    PrivilegeLevel level
) {}
