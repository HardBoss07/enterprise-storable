package dev.m4tt3o.storable.data.service;

import dev.m4tt3o.storable.core.dto.FileMetadataDto;
import dev.m4tt3o.storable.core.repository.FileNodePersistence;
import dev.m4tt3o.storable.data.entity.FileNode;
import dev.m4tt3o.storable.data.repository.FileNodeRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

/**
 * Persistence implementation using Spring Data JPA.
 */
@Slf4j
@Repository
@RequiredArgsConstructor
public class FileNodePersistenceImpl implements FileNodePersistence {

    private final FileNodeRepository repository;

    @Override
    /** Retrieves children of a given parent node. */
    public List<FileMetadataDto> findChildren(Long parentId) {
        log.debug("Finding children for parent ID: {}", parentId);
        List<FileNode> nodes = (parentId == null || parentId == 0) 
            ? repository.findByParentIdIsNull() 
            : repository.findByParentId(parentId);
            
        return nodes.stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    @Override
    /** Finds a node by its ID. */
    public Optional<FileMetadataDto> findById(Long id) {
        log.debug("Finding node by ID: {}", id);
        return repository.findById(id).map(this::toDto);
    }

    @Override
    /** Calculates the total size of files for an owner. */
    public long sumSizeByOwnerId(String ownerId) {
        log.debug("Summing size for owner ID: {}", ownerId);
        return repository.sumSizeByOwnerId(ownerId, FileNode.NodeKind.file);
    }

    @Override
    /** Saves a folder node. */
    public FileMetadataDto saveFolder(String name, Long parentId, String ownerId, String storageKey) {
        log.debug("Saving folder node: {}", name);
        FileNode node = new FileNode();
        node.setName(name);
        node.setParentId(parentId == null || parentId == 0 ? null : parentId);
        node.setOwnerId(ownerId);
        node.setStorageKey(storageKey);
        node.setKind(FileNode.NodeKind.folder);
        node.setMime("directory");
        
        return toDto(repository.save(node));
    }

    @Override
    /** Saves a file node. */
    public FileMetadataDto saveFile(String name, Long parentId, String ownerId, String storageKey, String mime, Long size) {
        log.debug("Saving file node: {}", name);
        FileNode node = new FileNode();
        node.setName(name);
        node.setParentId(parentId == null || parentId == 0 ? null : parentId);
        node.setOwnerId(ownerId);
        node.setStorageKey(storageKey);
        node.setKind(FileNode.NodeKind.file);
        node.setMime(mime);
        node.setSize(size);
        
        return toDto(repository.save(node));
    }

    @Override
    /** Finds a folder by owner, parent, and name. */
    public Optional<FileMetadataDto> findFolder(String ownerId, Long parentId, String name) {
        log.debug("Finding folder: {} for owner: {}", name, ownerId);
        return (parentId == null)
            ? repository.findByOwnerIdAndParentIdIsNullAndNameAndKind(ownerId, name, FileNode.NodeKind.folder).map(this::toDto)
            : repository.findByOwnerIdAndParentIdAndNameAndKind(ownerId, parentId, name, FileNode.NodeKind.folder).map(this::toDto);
    }

    /**
     * Maps a FileNode entity to a FileMetadataDto record.
     */
    private FileMetadataDto toDto(FileNode node) {
        return new FileMetadataDto(
            node.getId(),
            node.getName(),
            node.getSize(),
            node.getMime(),
            node.getStorageKey(),
            node.getCreatedAt(),
            node.getModifiedAt(),
            node.getDeletedAt(),
            node.getOwnerId(),
            node.getParentId(),
            node.getKind() == FileNode.NodeKind.folder
        );
    }
}
