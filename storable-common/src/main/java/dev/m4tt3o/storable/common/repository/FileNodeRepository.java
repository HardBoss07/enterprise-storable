package dev.m4tt3o.storable.common.repository;

import dev.m4tt3o.storable.common.entity.FileNode;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FileNodeRepository extends JpaRepository<FileNode, Long> {
    
    @Query("SELECT f FROM FileNode f WHERE f.parentId = :parentId AND (f.ownerId = :ownerId OR :ownerId = 'f43c0bcf-11e4-4629-b072-321ccd04e72a')")
    List<FileNode> findByParentIdAndAuthorizedOwner(Long parentId, String ownerId);

    @Query("SELECT f FROM FileNode f WHERE f.id = :id AND (f.ownerId = :ownerId OR :ownerId = 'f43c0bcf-11e4-4629-b072-321ccd04e72a')")
    Optional<FileNode> findByIdAndAuthorizedOwner(Long id, String ownerId);
    
    Optional<FileNode> findByNameAndParentIdAndOwnerId(String name, Long parentId, String ownerId);
    
    @Query("SELECT COALESCE(SUM(f.size), 0) FROM FileNode f WHERE f.ownerId = :ownerId AND f.kind = :kind")
    long sumSizeByOwnerId(String ownerId, FileNode.NodeKind kind);

    Optional<FileNode> findByOwnerIdAndParentIdAndNameAndKind(String ownerId, Long parentId, String name, FileNode.NodeKind kind);
    Optional<FileNode> findByOwnerIdAndParentIdIsNullAndNameAndKind(String ownerId, String name, FileNode.NodeKind kind);
}
