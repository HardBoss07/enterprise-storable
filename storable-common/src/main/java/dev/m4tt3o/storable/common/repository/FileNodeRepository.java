package dev.m4tt3o.storable.common.repository;

import dev.m4tt3o.storable.common.entity.FileNode;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FileNodeRepository extends JpaRepository<FileNode, Long> {
    List<FileNode> findByOwnerIdAndParentId(String ownerId, Long parentId);
    List<FileNode> findByOwnerIdAndParentIdIsNull(String ownerId);
    Optional<FileNode> findByIdAndOwnerId(Long id, String ownerId);
    
    @Query("SELECT COALESCE(SUM(f.size), 0) FROM FileNode f WHERE f.ownerId = :ownerId AND f.kind = :kind")
    long sumSizeByOwnerId(String ownerId, FileNode.NodeKind kind);

    Optional<FileNode> findByOwnerIdAndParentIdAndNameAndKind(String ownerId, Long parentId, String name, FileNode.NodeKind kind);
    Optional<FileNode> findByOwnerIdAndParentIdIsNullAndNameAndKind(String ownerId, String name, FileNode.NodeKind kind);
}
