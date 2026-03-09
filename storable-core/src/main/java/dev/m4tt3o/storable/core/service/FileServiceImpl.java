package dev.m4tt3o.storable.core.service;

import dev.m4tt3o.storable.common.dto.FileMetadataDto;
import dev.m4tt3o.storable.common.repository.FileNodePersistence;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.InputStream;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Stream;

/**
 * Implementation of the FileService business logic.
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class FileServiceImpl implements FileService {

    private final FileNodePersistence persistence;
    private final StorageService storageService;

    @Override
    /** Retrieves children of a given node for a specific owner. */
    public List<FileMetadataDto> getChildren(Long nodeId, String ownerId) {
        log.info("Retrieving children for node ID: {} and owner: {}", nodeId, ownerId);
        // If nodeId is null or 0, we treat it as root (which is ID 1 in our system)
        Long targetId = (nodeId == null || nodeId == 0) ? 1L : nodeId;
        return persistence.findChildren(targetId, ownerId);
    }

    @Override
    /** Retrieves metadata for a specific node and owner. */
    public FileMetadataDto getMetadata(Long nodeId, String ownerId) {
        log.info("Retrieving metadata for node ID: {} and owner: {}", nodeId, ownerId);
        // Special case: Root folder (ID 1) is accessible to everyone
        if (nodeId != null && nodeId == 1L) {
            return persistence.findByIdAndOwner(nodeId, "f43c0bcf-11e4-4629-b072-321ccd04e72a").orElse(null);
        }
        return persistence.findByIdAndOwner(nodeId, ownerId).orElse(null);
    }

    @Override
    /** Calculates the total size of all files for an owner. */
    public long getTotalSize(String ownerId) {
        log.info("Calculating total size for owner: {}", ownerId);
        return persistence.sumSizeByOwnerId(ownerId);
    }

    @Override
    @Transactional
    /** Creates a new folder. */
    public FileMetadataDto createFolder(String name, Long parentId, String ownerId) {
        log.info("Creating folder: {} in parent ID: {}", name, parentId);
        String storageKey = UUID.randomUUID().toString();
        // Default to root (ID 1) if parentId is null/0
        Long targetParentId = (parentId == null || parentId == 0) ? 1L : parentId;
        
        // Validation: Ensure parent belongs to owner
        if (targetParentId != 1L) {
             Optional<FileMetadataDto> parent = persistence.findByIdAndOwner(targetParentId, ownerId);
             if (parent.isEmpty()) {
                 throw new RuntimeException("Parent folder not found or access denied.");
             }
        }
        return persistence.saveFolder(name, targetParentId, ownerId, storageKey);
    }

    @Override
    @Transactional
    /** Creates folders recursively for a given path. */
    public FileMetadataDto createFolderRecursive(String path, String ownerId) {
        log.info("Creating recursive folders for path: {} and owner: {}", path, ownerId);
        if (path == null || path.isBlank()) {
            return null;
        }

        String[] parts = path.split("/");
        Long currentParentId = null;
        FileMetadataDto lastFolder = null;

        for (String part : parts) {
            if (part.isBlank()) continue;

            Optional<FileMetadataDto> existing = persistence.findFolder(ownerId, currentParentId, part);

            if (existing.isPresent()) {
                lastFolder = existing.get();
                currentParentId = lastFolder.id();
            } else {
                lastFolder = createFolder(part, currentParentId, ownerId);
                currentParentId = lastFolder.id();
            }
        }

        return lastFolder;
    }

    @Override
    @Transactional
    /** Uploads a file and stores its metadata. */
    public FileMetadataDto uploadFile(InputStream inputStream, String name, String mime, Long size, Long parentId, String ownerId) {
        log.info("Uploading file: {} for owner: {}", name, ownerId);
        
        // Default to root (ID 1) if parentId is null/0
        Long targetParentId = (parentId == null || parentId == 0) ? 1L : parentId;

        // Validation: Ensure parent belongs to owner
        if (targetParentId != 1L) {
             Optional<FileMetadataDto> parent = persistence.findByIdAndOwner(targetParentId, ownerId);
             if (parent.isEmpty()) {
                 throw new RuntimeException("Parent folder not found or access denied.");
             }
        }

        String storageKey = UUID.randomUUID().toString();
        
        // Physical storage
        storageService.store(inputStream, storageKey);
        
        // Metadata persistence
        return persistence.saveFile(name, targetParentId, ownerId, storageKey, mime, size);
    }

    @Override
    /** Retrieves an input stream for downloading a file for a specific owner. */
    public InputStream downloadFile(Long nodeId, String ownerId) {
        log.info("Downloading file with node ID: {} for owner: {}", nodeId, ownerId);
        FileMetadataDto metadata = persistence.findByIdAndOwner(nodeId, ownerId)
                .orElseThrow(() -> new RuntimeException("File not found or access denied: " + nodeId));
        
        if (!metadata.folder()) {
             return storageService.load(metadata.storageKey());
        } else {
             throw new RuntimeException("Cannot download a folder: " + nodeId);
        }
    }

    @Override
    /** Retrieves the home folder for a specific user. */
    public FileMetadataDto getHomeNode(String ownerId, String username) {
        log.info("Retrieving home node for owner: {} and username: {}", ownerId, username);
        if ("f43c0bcf-11e4-4629-b072-321ccd04e72a".equals(ownerId)) {
            return persistence.findByIdAndOwner(1L, ownerId).orElseThrow();
        }
        return persistence.findByNameParentAndOwner(username, 1L, ownerId)
                .orElseThrow(() -> new RuntimeException("Home folder not found for user: " + username));
    }

    @Override
    /** Retrieves the path (breadcrumbs) for a specific node, virtualized for the user. */
    public List<FileMetadataDto> getPath(Long nodeId, String ownerId, String username) {
        log.info("Retrieving path for node: {} and user: {}", nodeId, username);
        List<FileMetadataDto> pathArr = new java.util.ArrayList<>();
        Long tempId = (nodeId == null || nodeId == 0) ? 1L : nodeId;

        while (tempId != null) {
            final Long currentId = tempId;
            FileMetadataDto node = persistence.findByIdAndOwner(currentId, ownerId)
                    .orElseGet(() -> {
                         if (currentId == 1L) {
                             return persistence.findByIdAndOwner(1L, "f43c0bcf-11e4-4629-b072-321ccd04e72a").orElse(null);
                         }
                         return null;
                    });
            
            if (node == null) break;
            pathArr.add(0, node);
            tempId = node.parentId();
        }

        if ("f43c0bcf-11e4-4629-b072-321ccd04e72a".equals(ownerId)) {
            return pathArr;
        }

        // Truncate path for regular users: everything after the home folder (ID where name=username, parent=1)
        int homeIndex = -1;
        for (int i = 0; i < pathArr.size(); i++) {
            FileMetadataDto node = pathArr.get(i);
            if (username.equals(node.name()) && node.parentId() != null && node.parentId() == 1L) {
                homeIndex = i;
                break;
            }
        }

        if (homeIndex != -1) {
            return pathArr.subList(homeIndex + 1, pathArr.size());
        }

        return pathArr;
    }
}
