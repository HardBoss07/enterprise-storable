package dev.m4tt3o.storable.core.service;

import dev.m4tt3o.storable.core.dto.FileMetadataDto;
import java.io.InputStream;
import java.util.List;

public interface FileService {
    List<FileMetadataDto> getChildren(Long nodeId);
    FileMetadataDto getMetadata(Long nodeId);
    long getTotalSize(String ownerId);
    
    FileMetadataDto createFolder(String name, Long parentId, String ownerId);
    FileMetadataDto createFolderRecursive(String path, String ownerId);
    FileMetadataDto uploadFile(InputStream inputStream, String name, String mime, Long size, Long parentId, String ownerId);
    InputStream downloadFile(Long nodeId);
}
