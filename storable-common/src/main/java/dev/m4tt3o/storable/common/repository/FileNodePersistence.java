package dev.m4tt3o.storable.common.repository;

import dev.m4tt3o.storable.common.dto.FileMetadataDto;
import java.util.List;
import java.util.Optional;

/**
 * Interface for abstracting file node persistence.
 */
public interface FileNodePersistence {
    /** Retrieves children of a given parent node for a specific owner. */
    List<FileMetadataDto> findChildren(Long parentId, String ownerId);
    
    /** Finds a node by its ID and owner. */
    Optional<FileMetadataDto> findByIdAndOwner(Long id, String ownerId);
    
    /** Calculates the total size of files for an owner. */
    long sumSizeByOwnerId(String ownerId);
    
    /** Saves a folder node. */
    FileMetadataDto saveFolder(String name, Long parentId, String ownerId, String storageKey);
    
    /** Saves a file node. */
    FileMetadataDto saveFile(String name, Long parentId, String ownerId, String storageKey, String mime, Long size);
    
    /** Finds a folder by owner, parent, and name. */
    Optional<FileMetadataDto> findFolder(String ownerId, Long parentId, String name);

    /** Finds a node by its name, parent, and owner. */
    Optional<FileMetadataDto> findByNameParentAndOwner(String name, Long parentId, String ownerId);

    /** Soft deletes a node and all its children. */
    void softDelete(Long id, String ownerId);

    /** Restores a soft-deleted node and all its children. */
    void restore(Long id, String ownerId);

    /** Retrieves all soft-deleted nodes for an owner. */
    List<FileMetadataDto> findTrash(String ownerId);

    /** Retrieves all soft-deleted nodes (for ADMIN). */
    List<FileMetadataDto> findAllTrash();

    /** Permanently deletes a node. */
    void permanentlyDelete(Long id, String ownerId);

    /** Permanently deletes all nodes in trash for an owner. */
    void emptyTrash(String ownerId);

    /** Renames a node. */
    FileMetadataDto rename(Long id, String newName, String ownerId);

    /** Moves a node to a new parent folder. */
    FileMetadataDto move(Long id, Long targetParentId, String ownerId);

    /** Searches for nodes by name and kind for a specific owner. */
    List<FileMetadataDto> search(String query, String kind, String ownerId);

    /** Retrieves the 5 most recently modified files for a specific owner. */
    List<FileMetadataDto> findRecentFiles(String ownerId);

    /** Checks if a node with the given name exists in the parent globally (any owner, any state). */
    boolean existsByNameAndParentGlobal(String name, Long parentId);
}
