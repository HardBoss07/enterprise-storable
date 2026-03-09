package dev.m4tt3o.storable.data.service;

import dev.m4tt3o.storable.common.dto.FileMetadataDto;
import dev.m4tt3o.storable.common.repository.FileNodePersistence;
import dev.m4tt3o.storable.common.entity.FileNode;
import dev.m4tt3o.storable.common.repository.FileNodeRepository;
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
    /** Retrieves children of a given parent node for a specific owner. */
    public List<FileMetadataDto> findChildren(Long parentId, String ownerId) {
        log.debug("Finding children for parent ID: {} and owner: {}", parentId, ownerId);
        // If parentId is null or 0, we treat it as root (ID 1)
        Long targetParentId = (parentId == null || parentId == 0) ? 1L : parentId;
        List<FileNode> nodes = repository.findByParentIdAndAuthorizedOwner(targetParentId, ownerId);
            
        return nodes.stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    @Override
    /** Finds a node by its ID and owner. */
    public Optional<FileMetadataDto> findByIdAndOwner(Long id, String ownerId) {
        log.debug("Finding node by ID: {} and owner: {}", id, ownerId);
        return repository.findByIdAndAuthorizedOwner(id, ownerId).map(this::toDto);
    }
    
    // Note: Older methods kept for compatibility if needed, but updated interface requires implementation.
    // The interface updated findChildren(Long) to findChildren(Long, String).
    // So the old method signature is gone from interface, I must implement new one.
    // I already did above.

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

    @Override
    /** Finds a node by its name, parent, and owner. */
    public Optional<FileMetadataDto> findByNameParentAndOwner(String name, Long parentId, String ownerId) {
        log.debug("Finding node: {} by parent: {} and owner: {}", name, parentId, ownerId);
        return repository.findByNameAndParentIdAndOwnerId(name, parentId, ownerId).map(this::toDto);
    }
    
    // Needed to fulfill interface if I missed any?
    // Interface: findChildren, findByIdAndOwner, sumSizeByOwnerId, saveFolder, saveFile, findFolder.
    // I have all of them.

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
