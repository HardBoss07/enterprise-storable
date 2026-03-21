package dev.m4tt3o.storable.data.repository;

import dev.m4tt3o.storable.data.entity.AccessPrivilegeEntity;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AccessPrivilegeRepository
    extends JpaRepository<AccessPrivilegeEntity, Long>
{
    Optional<AccessPrivilegeEntity> findByNodeIdAndUserId(
        Long nodeId,
        String userId
    );

    List<AccessPrivilegeEntity> findByNodeId(Long nodeId);

    List<AccessPrivilegeEntity> findByUserId(String userId);

    void deleteByNodeIdAndUserId(Long nodeId, String userId);

    void deleteByNodeId(Long nodeId);
}
