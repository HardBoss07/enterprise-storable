package dev.m4tt3o.storable.core.service;

import dev.m4tt3o.storable.core.dto.FileMetadataDto;
import java.io.InputStream;
import java.util.List;

/**
 * Interface for business logic operations related to files and folders.
 */
public interface FileService {
    /** Retrieves children of a given node. */
    List<FileMetadataDto> getChildren(Long nodeId);
    
    /** Retrieves metadata for a specific node. */
    FileMetadataDto getMetadata(Long nodeId);
    
    /** Calculates the total size of all files for an owner. */
    long getTotalSize(String ownerId);
    
    /** Creates a new folder. */
    FileMetadataDto createFolder(String name, Long parentId, String ownerId);
    
    /** Creates folders recursively for a given path. */
    FileMetadataDto createFolderRecursive(String path, String ownerId);
    
    /** Uploads a file and stores its metadata. */
    FileMetadataDto uploadFile(InputStream inputStream, String name, String mime, Long size, Long parentId, String ownerId);
    
    /** Retrieves an input stream for downloading a file. */
    InputStream downloadFile(Long nodeId);
}
