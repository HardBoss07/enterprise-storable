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
}
