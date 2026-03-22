package dev.m4tt3o.storable.data.repository;

import dev.m4tt3o.storable.data.entity.NodeEntity;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

/**
 * Repository for general Node operations.
 */
@Repository
public interface NodeRepository extends JpaRepository<NodeEntity, Long> {
    List<NodeEntity> findByParentId(Long parentId);

    List<NodeEntity> findByOwnerId(String ownerId);

    List<NodeEntity> findByParentIdAndIsDeletedFalse(Long parentId);

    List<NodeEntity> findByOwnerIdAndIsDeletedTrue(String ownerId);

    @Query("SELECT n FROM NodeEntity n WHERE n.isDeleted = true")
    List<NodeEntity> findAllDeleted();

    @Query(
        "SELECT n FROM NodeEntity n WHERE n.ownerId = :ownerId AND n.name LIKE %:query% AND n.isDeleted = false"
    )
    List<NodeEntity> search(
        @Param("query") String query,
        @Param("ownerId") String ownerId
    );

    @Query(
        "SELECT n FROM NodeEntity n WHERE n.name LIKE %:query% AND n.isDeleted = false"
    )
    List<NodeEntity> searchGlobal(@Param("query") String query);

    List<NodeEntity> findByOwnerIdAndIsFavoriteTrueAndIsDeletedFalse(
        String ownerId
    );

    Optional<NodeEntity> findByIdAndOwnerId(Long id, String ownerId);
}
