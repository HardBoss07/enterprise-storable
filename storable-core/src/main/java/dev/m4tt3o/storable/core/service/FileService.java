package dev.m4tt3o.storable.core.service;

import dev.m4tt3o.storable.common.dto.FileMetadataDto;
import dev.m4tt3o.storable.common.dto.TrashMetadataDto;
import java.io.InputStream;
import java.util.List;

/**
 * Interface for business logic operations related to files and folders.
 */
public interface FileService {
    /** Retrieves children of a given node for a specific owner. */
    List<FileMetadataDto> getChildren(Long nodeId, String ownerId);
    
    /** Retrieves metadata for a specific node for a specific owner. */
    FileMetadataDto getMetadata(Long nodeId, String ownerId);
    
    /** Calculates the total size of all files for an owner. */
    long getTotalSize(String ownerId);
    
    /** Creates a new folder. */
    FileMetadataDto createFolder(String name, Long parentId, String ownerId);
    
    /** Creates folders recursively for a given path. */
    FileMetadataDto createFolderRecursive(String path, String ownerId);
    
    /** Uploads a file and stores its metadata. */
    FileMetadataDto uploadFile(InputStream inputStream, String name, String mime, Long size, Long parentId, String ownerId);
    
    /** Retrieves an input stream for downloading a file for a specific owner. */
    InputStream downloadFile(Long nodeId, String ownerId);

    /** Retrieves the home folder for a specific user. */
    FileMetadataDto getHomeNode(String ownerId, String username);

    /** Retrieves the path (breadcrumbs) for a specific node, virtualized for the user. */
    List<FileMetadataDto> getPath(Long nodeId, String ownerId, String username);

    /** Soft deletes a node. */
    void softDelete(Long nodeId, String ownerId);

    /** Restores a soft-deleted node. */
    void restore(Long nodeId, String ownerId);

    /** Retrieves all soft-deleted nodes for an owner. */
    List<TrashMetadataDto> getTrash(String ownerId);

    /** Retrieves all soft-deleted nodes (for ADMIN). */
    List<TrashMetadataDto> getAllTrash();

    /** Permanently deletes a node. */
    void permanentlyDelete(Long nodeId, String ownerId);

    /** Permanently deletes all nodes in trash for an owner. */
    void emptyTrash(String ownerId);

    /** Retrieves the global trash retention days. */
    int getTrashRetentionDays();

    /** Renames a file or folder. */
    FileMetadataDto rename(Long nodeId, String newName, String ownerId);

    /** Creates a duplicate of a file with an optional new name. */
    FileMetadataDto duplicate(Long nodeId, String newName, String ownerId);

    /** Moves a file or folder to a new destination. */
    FileMetadataDto move(Long nodeId, Long targetParentId, String ownerId);

    /** Searches for nodes by name and kind for a specific owner. */
    List<FileMetadataDto> search(String query, String kind, String ownerId);
}
