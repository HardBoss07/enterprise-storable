package dev.m4tt3o.storable.core.service;

import dev.m4tt3o.storable.common.dto.AccessPrivilegeDto;
import dev.m4tt3o.storable.common.dto.UserLookupDto;
import dev.m4tt3o.storable.common.entity.PrivilegeLevel;
import dev.m4tt3o.storable.core.domain.Storable;
import dev.m4tt3o.storable.core.domain.User;
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
    public AccessPrivilegeDto shareNode(
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

        Storable node = folderPersistencePort
            .findStorableById(nodeId)
            .orElseThrow(() ->
                new RuntimeException("Node not found: " + nodeId)
            );

        validateSharePermission(node, requesterId);
        validateTargetUserNotOwner(node, targetUserId);

        User targetUser = userPersistencePort
            .findById(targetUserId)
            .orElseThrow(() ->
                new RuntimeException("Target user not found: " + targetUserId)
            );

        sharingPersistencePort.grantPrivilege(nodeId, targetUserId, level);

        return new AccessPrivilegeDto(
            null,
            nodeId,
            targetUserId,
            targetUser.username(),
            targetUser.email(),
            level
        );
    }

    @Override
    @Transactional
    public AccessPrivilegeDto updatePrivilege(
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

        Storable node = folderPersistencePort
            .findStorableById(nodeId)
            .orElseThrow(() ->
                new RuntimeException("Node not found: " + nodeId)
            );

        if (
            !node.ownerId().equals(requesterId) &&
            !hasPermission(nodeId, requesterId, PrivilegeLevel.OWNER)
        ) {
            throw new RuntimeException(
                "Access denied: You don't have permission to manage shares for this node."
            );
        }

        sharingPersistencePort.revokePrivileges(nodeId, targetUserId);
    }

    @Override
    public List<AccessPrivilegeDto> getPrivileges(
        Long nodeId,
        String requesterId
    ) {
        log.info("Fetching privileges for node {}", nodeId);

        Storable node = folderPersistencePort
            .findStorableById(nodeId)
            .orElseThrow(() ->
                new RuntimeException("Node not found: " + nodeId)
            );

        if (
            !node.ownerId().equals(requesterId) &&
            !hasPermission(nodeId, requesterId, PrivilegeLevel.VIEW)
        ) {
            throw new RuntimeException(
                "Access denied: You don't have permission to view shares for this node."
            );
        }

        return sharingPersistencePort
            .findPrivilegesForNode(nodeId)
            .stream()
            .map(info -> {
                User user = userPersistencePort
                    .findById(info.userId())
                    .orElse(null);
                return new AccessPrivilegeDto(
                    null,
                    info.nodeId(),
                    info.userId(),
                    user != null ? user.username() : "Unknown",
                    user != null ? user.email() : "Unknown",
                    info.level()
                );
            })
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

    private void validateSharePermission(Storable node, String requesterId) {
        if (
            !node.ownerId().equals(requesterId) &&
            !hasPermission(node.id(), requesterId, PrivilegeLevel.OWNER)
        ) {
            throw new RuntimeException(
                "Access denied: You don't have permission to share this node."
            );
        }
    }

    private void validateTargetUserNotOwner(
        Storable node,
        String targetUserId
    ) {
        if (node.ownerId().equals(targetUserId)) {
            throw new RuntimeException("Target user is already the owner.");
        }
    }
}
