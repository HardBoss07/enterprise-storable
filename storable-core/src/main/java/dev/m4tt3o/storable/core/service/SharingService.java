package dev.m4tt3o.storable.core.service;

import dev.m4tt3o.storable.common.dto.AccessPrivilegeDto;
import dev.m4tt3o.storable.common.dto.UserLookupDto;
import dev.m4tt3o.storable.common.entity.AccessPrivilege.PrivilegeLevel;

import java.util.List;

/**
 * Service for managing file/folder sharing and access privileges.
 */
public interface SharingService {
    
    /** Lookup users by email or username. */
    List<UserLookupDto> lookupUsers(String query);

    /** Share a node with another user. */
    AccessPrivilegeDto shareNode(Long nodeId, String targetUserId, PrivilegeLevel level, String requesterId);

    /** Update an existing privilege. */
    AccessPrivilegeDto updatePrivilege(Long nodeId, String targetUserId, PrivilegeLevel level, String requesterId);

    /** Remove a privilege. */
    void removePrivilege(Long nodeId, String targetUserId, String requesterId);

    /** Get all privileges for a node. */
    List<AccessPrivilegeDto> getPrivileges(Long nodeId, String requesterId);

    /** Get all nodes shared with a specific user. */
    List<dev.m4tt3o.storable.common.dto.FileMetadataDto> getSharedWithMe(String userId);

    /** Check if a user has a specific permission level on a node. */
    boolean hasPermission(Long nodeId, String userId, PrivilegeLevel requiredLevel);
}
