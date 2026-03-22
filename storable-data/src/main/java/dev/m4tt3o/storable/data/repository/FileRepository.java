package dev.m4tt3o.storable.data.repository;

import dev.m4tt3o.storable.data.entity.FileEntity;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

/**
 * Repository for File-specific operations.
 */
@Repository
public interface FileRepository extends JpaRepository<FileEntity, Long> {
    @Query(
        "SELECT COALESCE(SUM(f.size), 0) FROM FileEntity f WHERE f.ownerId = :ownerId AND f.isDeleted = false"
    )
    long sumSizeByOwnerId(@Param("ownerId") String ownerId);

    List<FileEntity> findTop5ByOwnerIdAndIsDeletedFalseOrderByModifiedAtDesc(
        String ownerId
    );

    Optional<FileEntity> findByIdAndOwnerId(Long id, String ownerId);
}
