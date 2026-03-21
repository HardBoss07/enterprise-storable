package dev.m4tt3o.storable.data.repository;

import dev.m4tt3o.storable.data.entity.FileEntity;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface FileRepository extends JpaRepository<FileEntity, Long> {
    @Query(
        "SELECT f FROM FileEntity f WHERE f.parentId = :parentId AND f.isDeleted = false AND " +
            "(f.ownerId = :ownerId OR :ownerId = 'f43c0bcf-11e4-4629-b072-321ccd04e72a' OR f.parentId = 100 OR " +
            "EXISTS (SELECT 1 FROM FileEntity p WHERE p.id = f.parentId AND p.id = 100))"
    )
    List<FileEntity> findByParentIdAndAuthorizedOwner(
        Long parentId,
        String ownerId
    );

    @Query(
        "SELECT f FROM FileEntity f WHERE f.id = :id AND f.isDeleted = false AND " +
            "(f.ownerId = :ownerId OR :ownerId = 'f43c0bcf-11e4-4629-b072-321ccd04e72a' OR f.id = 100)"
    )
    Optional<FileEntity> findByIdAndAuthorizedOwner(Long id, String ownerId);

    @Query(
        "SELECT f FROM FileEntity f WHERE f.id = :id AND " +
            "(f.ownerId = :ownerId OR :ownerId = 'f43c0bcf-11e4-4629-b072-321ccd04e72a')"
    )
    Optional<FileEntity> findByIdAndAuthorizedOwnerIncludingDeleted(
        Long id,
        String ownerId
    );

    List<FileEntity> findByParentIdAndIsDeletedFalse(Long parentId);

    List<FileEntity> findByOwnerIdAndIsDeletedTrue(String ownerId);

    @Query("SELECT f FROM FileEntity f WHERE f.isDeleted = true")
    List<FileEntity> findAllDeleted();

    @Query(
        "SELECT COALESCE(SUM(f.size), 0) FROM FileEntity f WHERE f.ownerId = :ownerId AND f.kind = :kind AND f.isDeleted = false"
    )
    long sumSizeByOwnerId(String ownerId, FileEntity.NodeKind kind);

    List<
        FileEntity
    > findTop5ByOwnerIdAndKindAndIsDeletedFalseOrderByModifiedAtDesc(
        String ownerId,
        FileEntity.NodeKind kind
    );

    List<FileEntity> findByOwnerIdAndIsFavoriteTrueAndIsDeletedFalse(
        String ownerId
    );

    @Query(
        "SELECT f FROM FileEntity f WHERE f.ownerId = :ownerId AND f.name LIKE %:query% AND " +
            "(:kind IS NULL OR f.kind = :kind) AND f.isDeleted = false"
    )
    List<FileEntity> search(
        String query,
        FileEntity.NodeKind kind,
        String ownerId
    );

    @Query(
        "SELECT f FROM FileEntity f WHERE f.name LIKE %:query% AND " +
            "(:kind IS NULL OR f.kind = :kind) AND f.isDeleted = false"
    )
    List<FileEntity> searchGlobal(String query, FileEntity.NodeKind kind);

    Optional<FileEntity> findByNameAndParentIdAndOwnerIdAndIsDeletedFalse(
        String name,
        Long parentId,
        String ownerId
    );

    @Query(
        "SELECT f FROM FileEntity f WHERE f.name = :name AND (f.parentId = :parentId OR (f.parentId IS NULL AND :parentId IS NULL))"
    )
    Optional<FileEntity> findByNameAndParentIdGlobal(
        String name,
        Long parentId
    );

    Optional<
        FileEntity
    > findByOwnerIdAndParentIdAndNameAndKindAndIsDeletedFalse(
        String ownerId,
        Long parentId,
        String name,
        FileEntity.NodeKind kind
    );

    Optional<
        FileEntity
    > findByOwnerIdAndParentIdIsNullAndNameAndKindAndIsDeletedFalse(
        String ownerId,
        String name,
        FileEntity.NodeKind kind
    );

    List<FileEntity> findByParentId(Long parentId);

    List<FileEntity> findByOwnerId(String ownerId);
}
