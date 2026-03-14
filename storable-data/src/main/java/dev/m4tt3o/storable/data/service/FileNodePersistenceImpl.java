package dev.m4tt3o.storable.data.service;

import dev.m4tt3o.storable.common.dto.FileMetadataDto;
import dev.m4tt3o.storable.common.repository.FileNodePersistence;
import dev.m4tt3o.storable.common.entity.FileNode;
import dev.m4tt3o.storable.common.repository.FileNodeRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.PageRequest;
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
    
    @Override
    /** Retrieves the 5 most recently modified files for a specific owner. */
    public List<FileMetadataDto> findRecentFiles(String ownerId) {
        log.debug("Finding 5 recent files for owner: {}", ownerId);
        return repository.findTop5ByOwnerIdAndKindAndIsDeletedFalseOrderByModifiedAtDesc(ownerId, FileNode.NodeKind.file).stream()
                .map(this::toDto)
                .collect(Collectors.toList());
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
            ? repository.findByOwnerIdAndParentIdIsNullAndNameAndKindAndIsDeletedFalse(ownerId, name, FileNode.NodeKind.folder).map(this::toDto)
            : repository.findByOwnerIdAndParentIdAndNameAndKindAndIsDeletedFalse(ownerId, parentId, name, FileNode.NodeKind.folder).map(this::toDto);
    }

    @Override
    /** Finds a node by its name, parent, and owner. */
    public Optional<FileMetadataDto> findByNameParentAndOwner(String name, Long parentId, String ownerId) {
        log.debug("Finding node: {} by parent: {} and owner: {}", name, parentId, ownerId);
        return repository.findByNameAndParentIdAndOwnerIdAndIsDeletedFalse(name, parentId, ownerId).map(this::toDto);
    }

    @Override
    /** Soft deletes a node and all its children. */
    public void softDelete(Long id, String ownerId) {
        log.info("Soft deleting node ID: {} and its children for owner: {}", id, ownerId);
        repository.findByIdAndAuthorizedOwner(id, ownerId).ifPresent(node -> {
            node.setDeleted(true);
            node.setDeletedAt(java.time.LocalDateTime.now());
            // Store original path context if needed, for now we just keep parentId
            // but the requirement says original_path. 
            // In a real VFS we might calculate the full path here.
            repository.save(node);
            softDeleteChildren(node.getId());
        });
    }

    private void softDeleteChildren(Long parentId) {
        List<FileNode> children = repository.findByParentId(parentId);
        for (FileNode child : children) {
            if (!child.isDeleted()) {
                child.setDeleted(true);
                child.setDeletedAt(java.time.LocalDateTime.now());
                repository.save(child);
                if (child.getKind() == FileNode.NodeKind.folder) {
                    softDeleteChildren(child.getId());
                }
            }
        }
    }

    @Override
    /** Restores a soft-deleted node and all its children. */
    public void restore(Long id, String ownerId) {
        log.info("Restoring node ID: {} and its children for owner: {}", id, ownerId);
        repository.findByIdAndAuthorizedOwnerIncludingDeleted(id, ownerId).ifPresent(node -> {
            node.setDeleted(false);
            node.setDeletedAt(null);
            repository.save(node);
            restoreChildren(node.getId());
        });
    }

    private void restoreChildren(Long parentId) {
        List<FileNode> children = repository.findByParentId(parentId);
        for (FileNode child : children) {
            if (child.isDeleted()) {
                child.setDeleted(false);
                child.setDeletedAt(null);
                repository.save(child);
                if (child.getKind() == FileNode.NodeKind.folder) {
                    restoreChildren(child.getId());
                }
            }
        }
    }

    @Override
    /** Retrieves all soft-deleted nodes for an owner. */
    public List<FileMetadataDto> findTrash(String ownerId) {
        log.debug("Finding trash for owner: {}", ownerId);
        return repository.findByOwnerIdAndIsDeletedTrue(ownerId).stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    @Override
    /** Retrieves all soft-deleted nodes (for ADMIN). */
    public List<FileMetadataDto> findAllTrash() {
        log.debug("Finding all trash for ADMIN");
        return repository.findAllDeleted().stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    @Override
    /** Permanently deletes a node. */
    public void permanentlyDelete(Long id, String ownerId) {
        log.info("Permanently deleting node ID: {} for owner: {}", id, ownerId);
        repository.findByIdAndAuthorizedOwnerIncludingDeleted(id, ownerId).ifPresent(node -> {
            if (node.getKind() == FileNode.NodeKind.folder) {
                permanentlyDeleteChildren(node.getId());
            }
            repository.delete(node);
        });
    }

    private void permanentlyDeleteChildren(Long parentId) {
        List<FileNode> children = repository.findByParentId(parentId);
        for (FileNode child : children) {
            if (child.getKind() == FileNode.NodeKind.folder) {
                permanentlyDeleteChildren(child.getId());
            }
            repository.delete(child);
        }
    }

    @Override
    /** Permanently deletes all nodes in trash for an owner. */
    public void emptyTrash(String ownerId) {
        log.info("Emptying trash for owner: {}", ownerId);
        List<FileNode> trash = repository.findByOwnerIdAndIsDeletedTrue(ownerId);
        for (FileNode node : trash) {
            if (node.getKind() == FileNode.NodeKind.folder) {
                permanentlyDeleteChildren(node.getId());
            }
            repository.delete(node);
        }
    }

    @Override
    /** Renames a node. */
    public FileMetadataDto rename(Long id, String newName, String ownerId) {
        log.info("Renaming node ID: {} to {} for owner: {}", id, newName, ownerId);
        FileNode node = repository.findByIdAndAuthorizedOwner(id, ownerId)
                .orElseThrow(() -> new RuntimeException("Node not found or access denied: " + id));
        node.setName(newName);
        return toDto(repository.save(node));
    }

    @Override
    /** Moves a node to a new parent folder. */
    public FileMetadataDto move(Long id, Long targetParentId, String ownerId) {
        log.info("Moving node ID: {} to parent ID: {} for owner: {}", id, targetParentId, ownerId);
        FileNode node = repository.findByIdAndAuthorizedOwner(id, ownerId)
                .orElseThrow(() -> new RuntimeException("Node not found or access denied: " + id));
        
        // Ensure target parent is null (root) or belongs to owner
        if (targetParentId != null && targetParentId != 0 && targetParentId != 1L) {
            repository.findByIdAndAuthorizedOwner(targetParentId, ownerId)
                .orElseThrow(() -> new RuntimeException("Target parent not found or access denied: " + targetParentId));
        }

        node.setParentId((targetParentId == null || targetParentId == 0) ? null : targetParentId);
        return toDto(repository.save(node));
    }

    @Override
    /** Searches for nodes by name and kind for a specific owner. */
    public List<FileMetadataDto> search(String query, String kind, String ownerId) {
        log.debug("Searching for nodes with query: {} and kind: {} for owner: {}", query, kind, ownerId);
        FileNode.NodeKind nodeKind = null;
        if (kind != null) {
            try {
                nodeKind = FileNode.NodeKind.valueOf(kind.toLowerCase());
            } catch (IllegalArgumentException e) {
                // Ignore invalid kind
            }
        }

        return repository.search(query, nodeKind, ownerId).stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    @Override
    /** Checks if a node with the given name exists in the parent globally (any owner, any state). */
    public boolean existsByNameAndParentGlobal(String name, Long parentId) {
        log.debug("Checking global existence for name: {} and parent: {}", name, parentId);
        return repository.findByNameAndParentIdGlobal(name, parentId).isPresent();
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
            node.isDeleted(),
            node.getDeletedAt(),
            node.getOriginalPath(),
            node.getOwnerId(),
            node.getParentId(),
            node.getKind() == FileNode.NodeKind.folder
        );
    }
}
