package dev.m4tt3o.storable.data.adapter;

import dev.m4tt3o.storable.common.entity.PrivilegeLevel;
import dev.m4tt3o.storable.core.port.SharingPersistencePort;
import dev.m4tt3o.storable.data.entity.AccessPrivilegeEntity;
import dev.m4tt3o.storable.data.repository.AccessPrivilegeRepository;
import java.util.List;
import java.util.Optional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Component
@RequiredArgsConstructor
public class SharingPersistenceAdapter implements SharingPersistencePort {

    private final AccessPrivilegeRepository privilegeRepository;

    @Override
    public Optional<PrivilegeLevel> findHighestPrivilege(
        Long nodeId,
        String userId
    ) {
        return privilegeRepository
            .findByNodeIdAndUserId(nodeId, userId)
            .map(AccessPrivilegeEntity::getLevel);
    }

    @Override
    @Transactional
    public void grantPrivilege(
        Long nodeId,
        String userId,
        PrivilegeLevel level
    ) {
        AccessPrivilegeEntity entity = privilegeRepository
            .findByNodeIdAndUserId(nodeId, userId)
            .orElseGet(() ->
                AccessPrivilegeEntity.builder()
                    .nodeId(nodeId)
                    .userId(userId)
                    .build()
            );
        entity.setLevel(level);
        privilegeRepository.save(entity);
    }

    @Override
    @Transactional
    public void revokePrivileges(Long nodeId, String userId) {
        privilegeRepository.deleteByNodeIdAndUserId(nodeId, userId);
    }

    @Override
    @Transactional
    public void revokeAllForNode(Long nodeId) {
        privilegeRepository.deleteByNodeId(nodeId);
    }

    @Override
    public List<AccessPrivilegeInfo> findPrivilegesForNode(Long nodeId) {
        return privilegeRepository
            .findByNodeId(nodeId)
            .stream()
            .map(entity ->
                new AccessPrivilegeInfo(
                    entity.getNodeId(),
                    entity.getUserId(),
                    entity.getLevel()
                )
            )
            .toList();
    }

    @Override
    public List<Long> findSharedNodeIds(String userId) {
        return privilegeRepository
            .findByUserId(userId)
            .stream()
            .map(AccessPrivilegeEntity::getNodeId)
            .toList();
    }
}
