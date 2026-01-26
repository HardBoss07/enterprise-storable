package dev.m4tt3o.storable.data.repository;

import dev.m4tt3o.storable.data.entity.FileNode;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface FileNodeRepository extends JpaRepository<FileNode, Long> {
    List<FileNode> findByParentId(Long parentId);

    List<FileNode> findByOwnerIdAndParentIdIsNull(Long ownerId);

    List<FileNode> findByOwnerIdAndNameContainingIgnoreCase(Long ownerId, String name);

    List<FileNode> findByOwnerIdAndIsFolderOrderByModifiedAtDesc(Long ownerId, boolean isFolder);

    @Query("SELECT COALESCE(SUM(n.size), 0) FROM FileNode n WHERE n.ownerId = :ownerId AND n.isFolder = false")
    long sumSizeByOwnerId(@Param("ownerId") Long ownerId);
}
