package dev.m4tt3o.storable.common.repository;

import dev.m4tt3o.storable.common.entity.AccessPrivilege;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AccessPrivilegeRepository
    extends JpaRepository<AccessPrivilege, Long>
{
    List<AccessPrivilege> findByNodeId(Long nodeId);
    Optional<AccessPrivilege> findByNodeIdAndUserId(Long nodeId, String userId);
    List<AccessPrivilege> findByUserId(String userId);
    void deleteByNodeIdAndUserId(Long nodeId, String userId);
}
