package dev.m4tt3o.storable.core.service;

import dev.m4tt3o.storable.common.dto.FileMetadataDto;
import dev.m4tt3o.storable.common.dto.TrashMetadataDto;
import dev.m4tt3o.storable.common.repository.FileNodePersistence;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.InputStream;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

/**
 * Implementation of the FileService business logic.
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class FileServiceImpl implements FileService {

    private final FileNodePersistence persistence;
    private final StorageService storageService;
    private final ConfigService configService;

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

        // Collision Check
        if (persistence.existsByNameAndParentGlobal(name, targetParentId)) {
             throw new RuntimeException("A file or folder with this name already exists.");
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

            // Here we only check for existing folders the user owns or can see
            Optional<FileMetadataDto> existing = persistence.findFolder(ownerId, currentParentId, part);

            if (existing.isPresent()) {
                lastFolder = existing.get();
                currentParentId = lastFolder.id();
            } else {
                // This might still fail if a folder with same name exists but owned by someone else
                // in a global shared space, but createFolder will catch it.
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

        // Collision Check
        if (persistence.existsByNameAndParentGlobal(name, targetParentId)) {
             throw new RuntimeException("A file or folder with this name already exists.");
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

    @Override
    @Transactional
    public void softDelete(Long nodeId, String ownerId) {
        log.info("Soft deleting node: {} for owner: {}", nodeId, ownerId);
        persistence.softDelete(nodeId, ownerId);
    }

    @Override
    @Transactional
    public void restore(Long nodeId, String ownerId) {
        log.info("Restoring node: {} for owner: {}", nodeId, ownerId);
        persistence.restore(nodeId, ownerId);
    }

    @Override
    public List<TrashMetadataDto> getTrash(String ownerId) {
        log.info("Retrieving trash for owner: {}", ownerId);
        return persistence.findTrash(ownerId).stream()
                .map(this::toTrashDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<TrashMetadataDto> getAllTrash() {
        log.info("Retrieving all trash for ADMIN");
        return persistence.findAllTrash().stream()
                .map(this::toTrashDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public void permanentlyDelete(Long nodeId, String ownerId) {
        log.info("Permanently deleting node: {} for owner: {}", nodeId, ownerId);
        persistence.permanentlyDelete(nodeId, ownerId);
    }

    @Override
    @Transactional
    public void emptyTrash(String ownerId) {
        log.info("Emptying trash for owner: {}", ownerId);
        persistence.emptyTrash(ownerId);
    }

    @Override
    public int getTrashRetentionDays() {
        return configService.getTrashRetentionDays();
    }

    @Override
    @Transactional
    public FileMetadataDto rename(Long nodeId, String newName, String ownerId) {
        log.info("Renaming node: {} to: {} for owner: {}", nodeId, newName, ownerId);
        FileMetadataDto node = persistence.findByIdAndOwner(nodeId, ownerId)
                .orElseThrow(() -> new RuntimeException("Node not found or access denied: " + nodeId));

        String finalName = newName;
        if (!node.folder()) {
            // Validate: No invalid characters
            if (newName.matches(".*[\\\\/:*?\"<>|].*")) {
                throw new RuntimeException("Filename contains invalid characters.");
            }

            // Preservation of extension
            String originalName = node.name();
            int lastDotIndex = originalName.lastIndexOf('.');
            if (lastDotIndex != -1) {
                String extension = originalName.substring(lastDotIndex); // e.g., ".pdf"
                
                int newLastDotIndex = newName.lastIndexOf('.');
                String baseName = (newLastDotIndex != -1) ? newName.substring(0, newLastDotIndex) : newName;
                finalName = baseName + extension;
            }
        } else {
             if (newName.matches(".*[\\\\/:*?\"<>|].*")) {
                throw new RuntimeException("Folder name contains invalid characters.");
            }
        }

        // Collision Check: Ensure no other node has this name in the same parent
        if (persistence.existsByNameAndParentGlobal(finalName, node.parentId())) {
             throw new RuntimeException("A file or folder with this name already exists in the destination.");
        }

        return persistence.rename(nodeId, finalName, ownerId);
    }

    @Override
    @Transactional
    public FileMetadataDto duplicate(Long nodeId, String newName, String ownerId) {
        log.info("Duplicating node: {} with new name: {} for owner: {}", nodeId, newName, ownerId);
        FileMetadataDto original = persistence.findByIdAndOwner(nodeId, ownerId)
                .orElseThrow(() -> new RuntimeException("Node not found or access denied: " + nodeId));

        if (original.folder()) {
            throw new RuntimeException("Duplicating folders is not supported yet.");
        }

        String finalName;
        String originalName = original.name();
        int lastDotIndex = originalName.lastIndexOf('.');
        String extension = (lastDotIndex != -1) ? originalName.substring(lastDotIndex) : "";
        String baseName = (lastDotIndex != -1) ? originalName.substring(0, lastDotIndex) : originalName;

        if (newName != null && !newName.isBlank()) {
            // Apply rename logic for consistency
            if (newName.matches(".*[\\\\/:*?\"<>|].*")) {
                throw new RuntimeException("Filename contains invalid characters.");
            }
            
            // Preservation of extension (if source had one)
            if (!extension.isEmpty()) {
                int newLastDotIndex = newName.lastIndexOf('.');
                String newBaseName = (newLastDotIndex != -1) ? newName.substring(0, newLastDotIndex) : newName;
                finalName = newBaseName + extension;
            } else {
                finalName = newName;
            }

            // Collision Check
            if (persistence.existsByNameAndParentGlobal(finalName, original.parentId())) {
                throw new RuntimeException("A file or folder with this name already exists.");
            }
        } else {
            // Auto-generation logic (original behavior)
            finalName = originalName;
            int counter = 1;
            while (persistence.existsByNameAndParentGlobal(finalName, original.parentId())) {
                finalName = baseName + " " + counter + extension;
                counter++;
            }
        }

        // Deep Copy physical file
        String newStorageKey = UUID.randomUUID().toString();
        storageService.copy(original.storageKey(), newStorageKey);

        // Save Metadata
        return persistence.saveFile(finalName, original.parentId(), ownerId, newStorageKey, original.mime(), original.size());
    }

    @Override
    @Transactional
    public FileMetadataDto move(Long nodeId, Long targetParentId, String ownerId) {
        log.info("Moving node: {} to: {} for owner: {}", nodeId, targetParentId, ownerId);
        
        FileMetadataDto node = persistence.findByIdAndOwner(nodeId, ownerId)
                .orElseThrow(() -> new RuntimeException("Node not found or access denied: " + nodeId));

        // Circular Reference Protection
        if (node.folder()) {
            if (isSubfolder(nodeId, targetParentId, ownerId)) {
                throw new RuntimeException("Cannot move a folder into its own subfolder.");
            }
        }
        
        // Prevent moving to itself
        if (nodeId.equals(targetParentId)) {
             throw new RuntimeException("Cannot move a node to itself.");
        }

        return persistence.move(nodeId, targetParentId, ownerId);
    }

    @Override
    public List<FileMetadataDto> search(String query, String kind, String ownerId) {
        log.info("Searching for nodes with query: {} and kind: {} for owner: {}", query, kind, ownerId);
        return persistence.search(query, kind, ownerId);
    }

    @Override
    public List<FileMetadataDto> getRecentFiles(String ownerId) {
        log.info("Retrieving recent files for owner: {}", ownerId);
        return persistence.findRecentFiles(ownerId);
    }

    private boolean isSubfolder(Long folderId, Long targetParentId, String ownerId) {
        if (targetParentId == null || targetParentId == 0 || targetParentId == 1L) return false;
        if (folderId.equals(targetParentId)) return true;
        
        Long currentId = targetParentId;
        while (currentId != null && currentId != 1L) {
            Optional<FileMetadataDto> parent = persistence.findByIdAndOwner(currentId, ownerId);
            if (parent.isEmpty()) break;
            currentId = parent.get().parentId();
            if (folderId.equals(currentId)) return true;
        }
        return false;
    }

    private TrashMetadataDto toTrashDto(FileMetadataDto metadata) {
        long daysRemaining = 0;
        if (metadata.deletedAt() != null) {
            LocalDateTime expiryDate = metadata.deletedAt().plusDays(configService.getTrashRetentionDays());
            daysRemaining = java.time.temporal.ChronoUnit.DAYS.between(java.time.LocalDateTime.now(java.time.ZoneOffset.UTC), expiryDate);
            if (daysRemaining < 0) daysRemaining = 0;
        }
        return new TrashMetadataDto(metadata, daysRemaining);
    }
}
