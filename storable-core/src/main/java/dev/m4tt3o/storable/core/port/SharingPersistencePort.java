package dev.m4tt3o.storable.core.port;

import dev.m4tt3o.storable.common.entity.PrivilegeLevel;
import java.util.List;
import java.util.Optional;

/**
 * Port (Outbound) for sharing and privilege persistence operations.
 */
public interface SharingPersistencePort {
    /** Checks the highest privilege level a user has for a given item. */
    Optional<PrivilegeLevel> findHighestPrivilege(Long nodeId, String userId);

    /** Grants a privilege level to a user for an item. */
    void grantPrivilege(Long nodeId, String userId, PrivilegeLevel level);

    /** Revokes all privileges for a user from an item. */
    void revokePrivileges(Long nodeId, String userId);

    /** Revokes all privileges for an item (e.g., when it is deleted). */
    void revokeAllForNode(Long nodeId);

    /** Lists all privileges for a given item. */
    List<AccessPrivilegeInfo> findPrivilegesForNode(Long nodeId);

    /** Lists all items shared with a specific user. */
    List<Long> findSharedNodeIds(String userId);

    /** Record to represent sharing information in the domain. */
    record AccessPrivilegeInfo(
        Long nodeId,
        String userId,
        PrivilegeLevel level
    ) {}
}
