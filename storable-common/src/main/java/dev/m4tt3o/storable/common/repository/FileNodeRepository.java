package dev.m4tt3o.storable.common.repository;

import dev.m4tt3o.storable.common.entity.FileNode;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.Optional;

@Repository
public interface FileNodeRepository extends JpaRepository<FileNode, Long> {
    
    List<FileNode> findTop5ByOwnerIdAndKindAndIsDeletedFalseOrderByModifiedAtDesc(String ownerId, FileNode.NodeKind kind);

    @Query("SELECT f FROM FileNode f WHERE f.parentId = :parentId AND f.isDeleted = false AND (f.ownerId = :ownerId OR :ownerId = 'f43c0bcf-11e4-4629-b072-321ccd04e72a')")
    List<FileNode> findByParentIdAndAuthorizedOwner(Long parentId, String ownerId);

    @Query("SELECT f FROM FileNode f WHERE f.id = :id AND f.isDeleted = false AND (f.ownerId = :ownerId OR :ownerId = 'f43c0bcf-11e4-4629-b072-321ccd04e72a')")
    Optional<FileNode> findByIdAndAuthorizedOwner(Long id, String ownerId);
    
    @Query("SELECT f FROM FileNode f WHERE f.id = :id AND (f.ownerId = :ownerId OR :ownerId = 'f43c0bcf-11e4-4629-b072-321ccd04e72a')")
    Optional<FileNode> findByIdAndAuthorizedOwnerIncludingDeleted(Long id, String ownerId);

    Optional<FileNode> findByNameAndParentIdAndOwnerIdAndIsDeletedFalse(String name, Long parentId, String ownerId);
    
    @Query("SELECT COALESCE(SUM(f.size), 0) FROM FileNode f WHERE f.ownerId = :ownerId AND f.kind = :kind AND f.isDeleted = false")
    long sumSizeByOwnerId(String ownerId, FileNode.NodeKind kind);

    Optional<FileNode> findByOwnerIdAndParentIdAndNameAndKindAndIsDeletedFalse(String ownerId, Long parentId, String name, FileNode.NodeKind kind);
    Optional<FileNode> findByOwnerIdAndParentIdIsNullAndNameAndKindAndIsDeletedFalse(String ownerId, String name, FileNode.NodeKind kind);

    List<FileNode> findByOwnerIdAndIsDeletedTrue(String ownerId);

    @Query("SELECT f FROM FileNode f WHERE f.isDeleted = true")
    List<FileNode> findAllDeleted();

    List<FileNode> findByParentId(Long parentId);

    List<FileNode> findByOwnerId(String ownerId);

    @Query("SELECT f FROM FileNode f WHERE f.ownerId = :ownerId AND f.name LIKE %:query% AND (:kind IS NULL OR f.kind = :kind) AND f.isDeleted = false")
    List<FileNode> search(String query, FileNode.NodeKind kind, String ownerId);

    @Query("SELECT f FROM FileNode f WHERE f.name = :name AND (f.parentId = :parentId OR (f.parentId IS NULL AND :parentId IS NULL))")
    Optional<FileNode> findByNameAndParentIdGlobal(String name, Long parentId);
}
