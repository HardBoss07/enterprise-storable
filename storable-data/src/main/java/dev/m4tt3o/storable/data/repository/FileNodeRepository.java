package dev.m4tt3o.storable.data.repository;

import dev.m4tt3o.storable.data.entity.FileNode;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface FileNodeRepository extends JpaRepository<FileNode, String> {
    List<FileNode> findByParentId(String parentId);
}
