package dev.m4tt3o.storable.core.service;

import dev.m4tt3o.storable.common.dto.AccessPrivilegeDto;
import dev.m4tt3o.storable.common.dto.FileMetadataDto;
import dev.m4tt3o.storable.common.dto.UserLookupDto;
import dev.m4tt3o.storable.common.entity.AccessPrivilege;
import dev.m4tt3o.storable.common.entity.AccessPrivilege.PrivilegeLevel;
import dev.m4tt3o.storable.common.entity.FileNode;
import dev.m4tt3o.storable.common.repository.AccessPrivilegeRepository;
import dev.m4tt3o.storable.common.repository.FileNodeRepository;
import dev.m4tt3o.storable.core.domain.User;
import dev.m4tt3o.storable.core.port.UserPersistencePort;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
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

    private final AccessPrivilegeRepository privilegeRepository;
    private final FileNodeRepository nodeRepository;
    private final UserPersistencePort userPersistencePort;
    private final dev.m4tt3o.storable.common.repository.FileNodePersistence persistence;

    @Override
    public List<UserLookupDto> lookupUsers(String query) {
        log.info("Looking up users with query: {}", query);
        if (query == null || query.isBlank()) {
            return List.of();
        }

        return userPersistencePort
            .searchUsers(query)
            .stream()
            .map(u -> new UserLookupDto(u.id(), u.username(), u.email()))
            .collect(Collectors.toList());
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

        FileNode node = nodeRepository
            .findById(nodeId)
            .orElseThrow(() ->
                new RuntimeException("Node not found: " + nodeId)
            );

        validateSharePermission(node, requesterId);
        validateTargetUserNotOwner(node, targetUserId);

        // Check if user exists
        User targetUser = userPersistencePort
            .findById(targetUserId)
            .orElseThrow(() ->
                new RuntimeException("Target user not found: " + targetUserId)
            );

        // Create or update privilege
        AccessPrivilege privilege = privilegeRepository
            .findByNodeIdAndUserId(nodeId, targetUserId)
            .orElseGet(() -> {
                AccessPrivilege newPriv = new AccessPrivilege();
                newPriv.setNodeId(nodeId);
                newPriv.setUserId(targetUserId);
                return newPriv;
            });

        privilege.setLevel(level);
        privilege = privilegeRepository.save(privilege);

        return toDto(privilege, targetUser);
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

        FileNode node = nodeRepository
            .findById(nodeId)
            .orElseThrow(() ->
                new RuntimeException("Node not found: " + nodeId)
            );

        if (
            !node.getOwnerId().equals(requesterId) &&
            !hasPermission(nodeId, requesterId, PrivilegeLevel.OWNER)
        ) {
            throw new RuntimeException(
                "Access denied: You don't have permission to manage shares for this node."
            );
        }

        privilegeRepository.deleteByNodeIdAndUserId(nodeId, targetUserId);
    }

    @Override
    public List<AccessPrivilegeDto> getPrivileges(
        Long nodeId,
        String requesterId
    ) {
        log.info("Fetching privileges for node {}", nodeId);

        FileNode node = nodeRepository
            .findById(nodeId)
            .orElseThrow(() ->
                new RuntimeException("Node not found: " + nodeId)
            );

        if (
            !node.getOwnerId().equals(requesterId) &&
            !hasPermission(nodeId, requesterId, PrivilegeLevel.VIEW)
        ) {
            throw new RuntimeException(
                "Access denied: You don't have permission to view shares for this node."
            );
        }

        return privilegeRepository
            .findByNodeId(nodeId)
            .stream()
            .map(p -> {
                User user = userPersistencePort
                    .findById(p.getUserId())
                    .orElse(null);
                return toDto(p, user);
            })
            .collect(Collectors.toList());
    }

    @Override
    public List<FileMetadataDto> getSharedWithMe(String userId) {
        log.info("Fetching nodes shared with user {}", userId);
        List<Long> sharedNodeIds = privilegeRepository
            .findByUserId(userId)
            .stream()
            .map(AccessPrivilege::getNodeId)
            .collect(Collectors.toList());

        return persistence.findByIds(sharedNodeIds);
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
        // Root admin always has full access (OWNER)
        if ("f43c0bcf-11e4-4629-b072-321ccd04e72a".equals(userId)) {
            return PrivilegeLevel.OWNER;
        }

        Optional<FileNode> nodeOpt = nodeRepository.findById(nodeId);
        if (nodeOpt.isEmpty()) {
            return null;
        }
        FileNode node = nodeOpt.get();

        // Owner always has full access
        if (node.getOwnerId().equals(userId)) {
            return PrivilegeLevel.OWNER;
        }

        // Check explicit privilege
        Optional<AccessPrivilege> privilegeOpt =
            privilegeRepository.findByNodeIdAndUserId(nodeId, userId);
        if (privilegeOpt.isPresent()) {
            return privilegeOpt.get().getLevel();
        }

        // Recursive check: Inherit from parent
        if (node.getParentId() != null && node.getParentId() != 1L) {
            return getHighestPrivilege(node.getParentId(), userId);
        }

        return null;
    }

    private void validateSharePermission(FileNode node, String requesterId) {
        if (
            !node.getOwnerId().equals(requesterId) &&
            !hasPermission(node.getId(), requesterId, PrivilegeLevel.OWNER)
        ) {
            throw new RuntimeException(
                "Access denied: You don't have permission to share this node."
            );
        }
    }

    private void validateTargetUserNotOwner(
        FileNode node,
        String targetUserId
    ) {
        if (node.getOwnerId().equals(targetUserId)) {
            throw new RuntimeException("Target user is already the owner.");
        }
    }

    private AccessPrivilegeDto toDto(AccessPrivilege p, User user) {
        return new AccessPrivilegeDto(
            p.getId(),
            p.getNodeId(),
            p.getUserId(),
            user != null ? user.username() : "Unknown",
            user != null ? user.email() : "Unknown",
            p.getLevel()
        );
    }
}
