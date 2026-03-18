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
    private final SharingService sharingService;
    private final dev.m4tt3o.storable.common.repository.UserRepository userRepository;

    @Override
    /** Retrieves children of a given node for a specific owner. */
    public List<FileMetadataDto> getChildren(Long nodeId, String ownerId) {
        log.info("Retrieving children for node ID: {} and owner: {}", nodeId, ownerId);
        // If nodeId is null or 0, we treat it as root (which is ID 1 in our system)
        Long targetId = (nodeId == null || nodeId == 0) ? 1L : nodeId;
        
        // Permission check: Must have VIEW permission
        if (!sharingService.hasPermission(targetId, ownerId, dev.m4tt3o.storable.common.entity.AccessPrivilege.PrivilegeLevel.VIEW)) {
            throw new RuntimeException("Access denied: You don't have permission to view this folder.");
        }

        return enrichDtos(persistence.findChildren(targetId, ownerId), ownerId);
    }

    @Override
    /** Retrieves metadata for a specific node and owner. */
    public FileMetadataDto getMetadata(Long nodeId, String ownerId) {
        log.info("Retrieving metadata for node ID: {} and owner: {}", nodeId, ownerId);
        
        // Permission check
        if (!sharingService.hasPermission(nodeId, ownerId, dev.m4tt3o.storable.common.entity.AccessPrivilege.PrivilegeLevel.VIEW)) {
            return null;
        }

        // We use a more generic fetch here since sharing is allowed
        FileMetadataDto dto = persistence.findByIds(List.of(nodeId)).stream().findFirst().orElse(null);
        return enrichDto(dto, ownerId);
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
        
        // Validation: Ensure user has EDIT permission on parent
        if (!sharingService.hasPermission(targetParentId, ownerId, dev.m4tt3o.storable.common.entity.AccessPrivilege.PrivilegeLevel.EDIT)) {
             throw new RuntimeException("Access denied: You don't have permission to create folders here.");
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

            // Here we check for existing folders the user can see
            // Note: findFolder in persistence might still only check owner.
            // But for path resolution, we might need a more global check.
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

        // Validation: Ensure user has EDIT permission on parent
        if (!sharingService.hasPermission(targetParentId, ownerId, dev.m4tt3o.storable.common.entity.AccessPrivilege.PrivilegeLevel.EDIT)) {
             throw new RuntimeException("Access denied: You don't have permission to upload files here.");
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
        
        if (!sharingService.hasPermission(nodeId, ownerId, dev.m4tt3o.storable.common.entity.AccessPrivilege.PrivilegeLevel.VIEW)) {
            throw new RuntimeException("Access denied: You don't have permission to download this file.");
        }

        FileMetadataDto metadata = persistence.findByIds(List.of(nodeId)).stream().findFirst()
                .orElseThrow(() -> new RuntimeException("File not found: " + nodeId));
        
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
            FileMetadataDto root = persistence.findByIdAndOwner(1L, ownerId).orElseThrow();
            return enrichDto(root, ownerId);
        }

        String resolvedUsername = username;
        if (resolvedUsername == null) {
            resolvedUsername = userRepository.findById(ownerId)
                    .map(dev.m4tt3o.storable.common.entity.User::getUsername)
                    .orElseThrow(() -> new RuntimeException("User not found: " + ownerId));
        }
        final String effectiveUsername = resolvedUsername;

        FileMetadataDto home = persistence.findByNameParentAndOwner(effectiveUsername, 1L, ownerId)
                .orElseThrow(() -> new RuntimeException("Home folder not found for user: " + effectiveUsername));
        return enrichDto(home, ownerId);
    }

    @Override
    /** Retrieves the path (breadcrumbs) for a specific node, virtualized for the user. */
    public List<FileMetadataDto> getPath(Long nodeId, String ownerId, String username) {
        log.info("Retrieving path for node: {} and user: {}", nodeId, username);
        List<FileMetadataDto> pathArr = new java.util.ArrayList<>();
        Long tempId = (nodeId == null || nodeId == 0) ? 1L : nodeId;

        while (tempId != null) {
            final Long currentId = tempId;
            // Check permission at each level (actually we just need to see the node)
            if (!sharingService.hasPermission(currentId, ownerId, dev.m4tt3o.storable.common.entity.AccessPrivilege.PrivilegeLevel.VIEW)) {
                break;
            }

            FileMetadataDto node = persistence.findByIds(List.of(currentId)).stream().findFirst()
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

        List<FileMetadataDto> finalPath;
        if ("f43c0bcf-11e4-4629-b072-321ccd04e72a".equals(ownerId)) {
            finalPath = pathArr;
        } else {
            String effectiveUsername = username;
            if (effectiveUsername == null) {
                effectiveUsername = userRepository.findById(ownerId)
                        .map(dev.m4tt3o.storable.common.entity.User::getUsername)
                        .orElse(null);
            }

            if (effectiveUsername == null) {
                finalPath = pathArr;
            } else {
                // Truncate path for regular users: everything after the home folder (ID where name=username, parent=1)
                int homeIndex = -1;
                for (int i = 0; i < pathArr.size(); i++) {
                    FileMetadataDto node = pathArr.get(i);
                    if (effectiveUsername.equals(node.name()) && node.parentId() != null && node.parentId() == 1L) {
                        homeIndex = i;
                        break;
                    }
                }

                if (homeIndex != -1) {
                    finalPath = pathArr.subList(homeIndex + 1, pathArr.size());
                } else {
                    finalPath = pathArr;
                }
            }
        }
        
        return enrichDtos(finalPath, ownerId);
    }

    @Override
    @Transactional
    public void softDelete(Long nodeId, String ownerId) {
        log.info("Soft deleting node: {} for owner: {}", nodeId, ownerId);
        if (!sharingService.hasPermission(nodeId, ownerId, dev.m4tt3o.storable.common.entity.AccessPrivilege.PrivilegeLevel.OWNER)) {
            throw new RuntimeException("Access denied: You don't have permission to delete this node.");
        }
        
        FileMetadataDto node = persistence.findByIds(List.of(nodeId)).stream().findFirst()
                .orElseThrow(() -> new RuntimeException("Node not found: " + nodeId));
        
        if (node.parentId() != null && node.parentId() == 1L) {
            throw new RuntimeException("Access denied: Cannot delete a root-level directory.");
        }

        persistence.softDelete(nodeId, ownerId);
    }

    @Override
    @Transactional
    public void restore(Long nodeId, String ownerId) {
        log.info("Restoring node: {} for owner: {}", nodeId, ownerId);
        if (!sharingService.hasPermission(nodeId, ownerId, dev.m4tt3o.storable.common.entity.AccessPrivilege.PrivilegeLevel.OWNER)) {
            throw new RuntimeException("Access denied: You don't have permission to restore this node.");
        }
        persistence.restore(nodeId, ownerId);
    }

    @Override
    public List<TrashMetadataDto> getTrash(String ownerId) {
        log.info("Retrieving trash for owner: {}", ownerId);
        return enrichTrashDtos(persistence.findTrash(ownerId), ownerId);
    }

    @Override
    public List<TrashMetadataDto> getAllTrash() {
        log.info("Retrieving all trash for ADMIN");
        // For admin trash, we don't necessarily have a specific user context for privileges
        // but we'll use the system admin UUID.
        String adminId = "f43c0bcf-11e4-4629-b072-321ccd04e72a";
        return enrichTrashDtos(persistence.findAllTrash(), adminId);
    }

    @Override
    @Transactional
    public void permanentlyDelete(Long nodeId, String ownerId) {
        log.info("Permanently deleting node: {} for owner: {}", nodeId, ownerId);
        if (!sharingService.hasPermission(nodeId, ownerId, dev.m4tt3o.storable.common.entity.AccessPrivilege.PrivilegeLevel.OWNER)) {
            throw new RuntimeException("Access denied: You don't have permission to permanently delete this node.");
        }
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
        
        if (!sharingService.hasPermission(nodeId, ownerId, dev.m4tt3o.storable.common.entity.AccessPrivilege.PrivilegeLevel.EDIT)) {
            throw new RuntimeException("Access denied: You don't have permission to rename this node.");
        }

        FileMetadataDto node = persistence.findByIds(List.of(nodeId)).stream().findFirst()
                .orElseThrow(() -> new RuntimeException("Node not found: " + nodeId));

        // Root Node Protection
        if (node.parentId() != null && node.parentId() == 1L) {
             throw new RuntimeException("Access denied: Cannot rename root-level directories.");
        }

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

        // Note: rename implementation in persistence still uses findByIdAndOwner, I might need to update it
        // Or just use the original owner of the node.
        FileMetadataDto renamed = persistence.rename(nodeId, finalName, node.ownerId());
        return enrichDto(renamed, ownerId);
    }

    @Override
    @Transactional
    public FileMetadataDto duplicate(Long nodeId, String newName, String ownerId) {
        log.info("Duplicating node: {} with new name: {} for owner: {}", nodeId, newName, ownerId);
        
        if (!sharingService.hasPermission(nodeId, ownerId, dev.m4tt3o.storable.common.entity.AccessPrivilege.PrivilegeLevel.VIEW)) {
            throw new RuntimeException("Access denied: You don't have permission to duplicate this node.");
        }

        FileMetadataDto original = persistence.findByIds(List.of(nodeId)).stream().findFirst()
                .orElseThrow(() -> new RuntimeException("Node not found: " + nodeId));

        if (original.folder()) {
            throw new RuntimeException("Duplicating folders is not supported yet.");
        }

        // Duplicate created by user, so it belongs to user
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

        // Save Metadata - Duplicate belongs to the one who duplicated it
        FileMetadataDto saved = persistence.saveFile(finalName, original.parentId(), ownerId, newStorageKey, original.mime(), original.size());
        return enrichDto(saved, ownerId);
    }

    @Override
    @Transactional
    public FileMetadataDto move(Long nodeId, Long targetParentId, String ownerId) {
        log.info("Moving node: {} to: {} for owner: {}", nodeId, targetParentId, ownerId);
        
        if (!sharingService.hasPermission(nodeId, ownerId, dev.m4tt3o.storable.common.entity.AccessPrivilege.PrivilegeLevel.EDIT)) {
            throw new RuntimeException("Access denied: You don't have permission to move this node.");
        }

        if (!sharingService.hasPermission(targetParentId, ownerId, dev.m4tt3o.storable.common.entity.AccessPrivilege.PrivilegeLevel.EDIT)) {
            throw new RuntimeException("Access denied: You don't have permission to move items into the target folder.");
        }

        FileMetadataDto node = persistence.findByIds(List.of(nodeId)).stream().findFirst()
                .orElseThrow(() -> new RuntimeException("Node not found: " + nodeId));

        // Root Node Protection
        if (node.parentId() != null && node.parentId() == 1L) {
             throw new RuntimeException("Access denied: Cannot move root-level directories.");
        }

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

        FileMetadataDto moved = persistence.move(nodeId, targetParentId, node.ownerId());
        return enrichDto(moved, ownerId);
    }

    @Override
    public List<FileMetadataDto> search(String query, String kind, String ownerId) {
        log.info("Searching for nodes with query: {} and kind: {} for owner: {}", query, kind, ownerId);
        List<FileMetadataDto> results;
        if ("f43c0bcf-11e4-4629-b072-321ccd04e72a".equals(ownerId)) {
            results = persistence.searchGlobal(query, kind);
        } else {
            results = persistence.search(query, kind, ownerId);
        }
        return enrichDtos(results, ownerId);
    }

    @Override
    public List<FileMetadataDto> getRecentFiles(String ownerId) {
        log.info("Retrieving recent files for owner: {}", ownerId);
        return enrichDtos(persistence.findRecentFiles(ownerId), ownerId);
    }

    @Override
    public List<FileMetadataDto> getFavorites(String ownerId) {
        log.info("Retrieving favorites for owner: {}", ownerId);
        return enrichDtos(persistence.findFavorites(ownerId), ownerId);
    }

    @Override
    @Transactional
    public FileMetadataDto toggleFavorite(Long nodeId, boolean isFavorite, String ownerId) {
        log.info("Toggling favorite for node: {} to: {} for owner: {}", nodeId, isFavorite, ownerId);
        if (!sharingService.hasPermission(nodeId, ownerId, dev.m4tt3o.storable.common.entity.AccessPrivilege.PrivilegeLevel.VIEW)) {
            throw new RuntimeException("Access denied: You don't have permission to favorite this node.");
        }

        FileMetadataDto node = persistence.findByIds(List.of(nodeId)).stream().findFirst()
                .orElseThrow(() -> new RuntimeException("Node not found: " + nodeId));

        FileMetadataDto toggled = persistence.toggleFavorite(nodeId, isFavorite, node.ownerId());
        return enrichDto(toggled, ownerId);
    }

    private FileMetadataDto enrichDto(FileMetadataDto dto, String userId) {
        if (dto == null) return null;
        return new FileMetadataDto(
                dto.id(), dto.name(), dto.size(), dto.mime(), dto.storageKey(),
                dto.createdAt(), dto.modifiedAt(), dto.isDeleted(), dto.deletedAt(),
                dto.originalPath(), dto.isFavorite(), dto.ownerId(), dto.parentId(),
                dto.folder(), sharingService.getHighestPrivilege(dto.id(), userId)
        );
    }

    private List<FileMetadataDto> enrichDtos(List<FileMetadataDto> dtos, String userId) {
        return dtos.stream().map(d -> enrichDto(d, userId)).collect(Collectors.toList());
    }

    private List<TrashMetadataDto> enrichTrashDtos(List<FileMetadataDto> dtos, String userId) {
        return dtos.stream().map(d -> toTrashDto(enrichDto(d, userId))).collect(Collectors.toList());
    }

    private boolean isSubfolder(Long folderId, Long targetParentId, String ownerId) {
        if (targetParentId == null || targetParentId == 0 || targetParentId == 1L) return false;
        if (folderId.equals(targetParentId)) return true;
        
        Long currentId = targetParentId;
        while (currentId != null && currentId != 1L) {
            // Here we use a more global check for subfolder detection
            Optional<FileMetadataDto> parent = persistence.findByIds(List.of(currentId)).stream().findFirst();
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
