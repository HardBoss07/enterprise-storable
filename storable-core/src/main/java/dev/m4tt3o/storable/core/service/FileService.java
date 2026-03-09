package dev.m4tt3o.storable.core.service;

import dev.m4tt3o.storable.common.dto.FileMetadataDto;
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
}
