package dev.m4tt3o.storable.core.service;

import dev.m4tt3o.storable.common.dto.UserLookupDto;
import dev.m4tt3o.storable.common.entity.PrivilegeLevel;
import dev.m4tt3o.storable.core.domain.AccessPrivilege;
import dev.m4tt3o.storable.core.domain.Storable;
import dev.m4tt3o.storable.core.domain.User;
import dev.m4tt3o.storable.core.exception.DuplicateResourceException;
import dev.m4tt3o.storable.core.exception.ResourceNotFoundException;
import dev.m4tt3o.storable.core.exception.UnauthorizedAccessException;
import dev.m4tt3o.storable.core.port.FolderPersistencePort;
import dev.m4tt3o.storable.core.port.SharingPersistencePort;
import dev.m4tt3o.storable.core.port.UserPersistencePort;
import java.util.List;
import java.util.Optional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Implementation of SharingService for managing node permissions.
 * Complies with the 20-line rule and follows Hexagonal Architecture.
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class SharingServiceImpl implements SharingService {

    private final SharingPersistencePort sharingPersistencePort;
    private final FolderPersistencePort folderPersistencePort;
    private final UserPersistencePort userPersistencePort;

    private static final String ADMIN_ID =
        "f43c0bcf-11e4-4629-b072-321ccd04e72a";
    private static final Long ROOT_ID = 1L;

    @Override
    public List<UserLookupDto> lookupUsers(String query) {
        log.info("Looking up users with query: {}", query);
        if (query == null || query.isBlank()) return List.of();

        return userPersistencePort
            .searchUsers(query)
            .stream()
            .map(u -> new UserLookupDto(u.id(), u.username(), u.email()))
            .toList();
    }

    @Override
    @Transactional
    public AccessPrivilege shareNode(
        Long nodeId,
        String targetUserId,
        PrivilegeLevel level,
        String requesterId
    ) {
        log.info(
            "Sharing node {} with user {} at level {}",
            nodeId,
            targetUserId,
            level
        );

        Storable node = findNode(nodeId);
        verifySharePermission(node, requesterId);
        verifyTargetUserNotOwner(node, targetUserId);

        User targetUser = findTargetUser(targetUserId);
        sharingPersistencePort.grantPrivilege(nodeId, targetUserId, level);

        return buildAccessPrivilege(nodeId, targetUser, level);
    }

    @Override
    @Transactional
    public AccessPrivilege updatePrivilege(
        Long nodeId,
        String targetUserId,
        PrivilegeLevel level,
        String requesterId
    ) {
        return shareNode(nodeId, targetUserId, level, requesterId);
    }

    @Override
    @Transactional
    public void removePrivilege(
        Long nodeId,
        String targetUserId,
        String requesterId
    ) {
        log.info(
            "Removing privilege for node {} and user {}",
            nodeId,
            targetUserId
        );

        Storable node = findNode(nodeId);
        verifyManageSharePermission(node, requesterId);

        sharingPersistencePort.revokePrivileges(nodeId, targetUserId);
    }

    @Override
    public List<AccessPrivilege> getPrivileges(
        Long nodeId,
        String requesterId
    ) {
        log.info("Fetching privileges for node {}", nodeId);

        Storable node = findNode(nodeId);
        verifyViewSharePermission(node, requesterId);

        return sharingPersistencePort
            .findPrivilegesForNode(nodeId)
            .stream()
            .map(this::mapToAccessPrivilege)
            .toList();
    }

    @Override
    public List<Storable> getSharedWithMe(String userId) {
        log.info("Fetching nodes shared with user {}", userId);
        List<Long> sharedNodeIds = sharingPersistencePort.findSharedNodeIds(
            userId
        );
        return folderPersistencePort.findStorableByIds(sharedNodeIds);
    }

    @Override
    public boolean hasPermission(
        Long nodeId,
        String userId,
        PrivilegeLevel requiredLevel
    ) {
        PrivilegeLevel actualLevel = getHighestPrivilege(nodeId, userId);
        return (
            actualLevel != null &&
            actualLevel.ordinal() >= requiredLevel.ordinal()
        );
    }

    @Override
    public PrivilegeLevel getHighestPrivilege(Long nodeId, String userId) {
        if (ADMIN_ID.equals(userId)) return PrivilegeLevel.OWNER;

        Optional<Storable> nodeOpt = folderPersistencePort.findStorableById(
            nodeId
        );
        if (nodeOpt.isEmpty()) return null;
        Storable node = nodeOpt.get();

        if (node.ownerId().equals(userId)) return PrivilegeLevel.OWNER;

        Optional<PrivilegeLevel> explicitPrivilege =
            sharingPersistencePort.findHighestPrivilege(nodeId, userId);
        if (explicitPrivilege.isPresent()) return explicitPrivilege.get();

        if (node.parentId() != null && !ROOT_ID.equals(node.parentId())) {
            return getHighestPrivilege(node.parentId(), userId);
        }

        return null;
    }

    // --- Private Atomic Helper Methods ---

    private Storable findNode(Long nodeId) {
        return folderPersistencePort
            .findStorableById(nodeId)
            .orElseThrow(() ->
                new ResourceNotFoundException("Node not found: " + nodeId)
            );
    }

    private User findTargetUser(String userId) {
        return userPersistencePort
            .findById(userId)
            .orElseThrow(() ->
                new ResourceNotFoundException(
                    "Target user not found: " + userId
                )
            );
    }

    private void verifySharePermission(Storable node, String requesterId) {
        if (
            !node.ownerId().equals(requesterId) &&
            !hasPermission(node.id(), requesterId, PrivilegeLevel.OWNER)
        ) {
            throw new UnauthorizedAccessException(
                "Access denied: You don't have permission to share this node."
            );
        }
    }

    private void verifyManageSharePermission(
        Storable node,
        String requesterId
    ) {
        if (
            !node.ownerId().equals(requesterId) &&
            !hasPermission(node.id(), requesterId, PrivilegeLevel.OWNER)
        ) {
            throw new UnauthorizedAccessException(
                "Access denied: You don't have permission to manage shares for this node."
            );
        }
    }

    private void verifyViewSharePermission(Storable node, String requesterId) {
        if (
            !node.ownerId().equals(requesterId) &&
            !hasPermission(node.id(), requesterId, PrivilegeLevel.VIEW)
        ) {
            throw new UnauthorizedAccessException(
                "Access denied: You don't have permission to view shares for this node."
            );
        }
    }

    private void verifyTargetUserNotOwner(Storable node, String targetUserId) {
        if (node.ownerId().equals(targetUserId)) {
            throw new DuplicateResourceException(
                "Target user is already the owner."
            );
        }
    }

    private AccessPrivilege buildAccessPrivilege(
        Long nodeId,
        User targetUser,
        PrivilegeLevel level
    ) {
        return AccessPrivilege.builder()
            .nodeId(nodeId)
            .userId(targetUser.id())
            .username(targetUser.username())
            .email(targetUser.email())
            .level(level)
            .build();
    }

    private AccessPrivilege mapToAccessPrivilege(
        SharingPersistencePort.AccessPrivilegeInfo info
    ) {
        User user = userPersistencePort.findById(info.userId()).orElse(null);
        return AccessPrivilege.builder()
            .nodeId(info.nodeId())
            .userId(info.userId())
            .username(user != null ? user.username() : "Unknown")
            .email(user != null ? user.email() : "Unknown")
            .level(info.level())
            .build();
    }
}
