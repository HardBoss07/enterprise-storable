package dev.m4tt3o.storable.data.repository;

import dev.m4tt3o.storable.data.entity.FolderEntity;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/**
 * Repository for Folder-specific operations.
 */
@Repository
public interface FolderRepository extends JpaRepository<FolderEntity, Long> {
    Optional<FolderEntity> findByNameAndParentIdAndOwnerIdAndIsDeletedFalse(
        String name,
        Long parentId,
        String ownerId
    );

    boolean existsByNameAndParentIdAndIsDeletedFalse(
        String name,
        Long parentId
    );

    Optional<FolderEntity> findByIdAndOwnerId(Long id, String ownerId);
}
