package dev.m4tt3o.storable.core.service;

import dev.m4tt3o.storable.common.entity.PrivilegeLevel;
import dev.m4tt3o.storable.core.domain.File;
import dev.m4tt3o.storable.core.domain.Folder;
import dev.m4tt3o.storable.core.domain.Storable;
import dev.m4tt3o.storable.core.domain.TrashItem;
import dev.m4tt3o.storable.core.domain.User;
import dev.m4tt3o.storable.core.port.FilePersistencePort;
import dev.m4tt3o.storable.core.port.FolderPersistencePort;
import dev.m4tt3o.storable.core.port.UserPersistencePort;
import java.io.InputStream;
import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.SequencedCollection;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Implementation of the FileService business logic.
 * Uses split persistence ports (File and Folder) to maintain domain boundaries.
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class FileServiceImpl implements FileService {

    private final FilePersistencePort filePersistencePort;
    private final FolderPersistencePort folderPersistencePort;
    private final StorageService storageService;
    private final ConfigService configService;
    private final SharingService sharingService;
    private final UserPersistencePort userPersistencePort;

    private static final String ADMIN_ID =
        "f43c0bcf-11e4-4629-b072-321ccd04e72a";
    private static final Long ROOT_ID = 1L;

    @Override
    public SequencedCollection<Storable> getChildren(
        Long nodeId,
        String ownerId
    ) {
        log.info(
            "Retrieving children for node ID: {} and owner: {}",
            nodeId,
            ownerId
        );
        Long targetId = resolveTargetId(nodeId);

        validatePermission(
            targetId,
            ownerId,
            PrivilegeLevel.VIEW,
            "Access denied: You don't have permission to view this folder."
        );

        return folderPersistencePort.findChildren(targetId);
    }

    @Override
    public Storable getMetadata(Long nodeId, String ownerId) {
        log.info(
            "Retrieving metadata for node ID: {} and owner: {}",
            nodeId,
            ownerId
        );
        if (
            !sharingService.hasPermission(nodeId, ownerId, PrivilegeLevel.VIEW)
        ) {
            return null;
        }
        return folderPersistencePort.findStorableById(nodeId).orElse(null);
    }

    @Override
    public long getTotalSize(String ownerId) {
        log.info("Calculating total size for owner: {}", ownerId);
        return filePersistencePort.sumSizeByOwner(ownerId);
    }

    @Override
    @Transactional
    public Folder createFolder(String name, Long parentId, String ownerId) {
        log.info("Creating folder: {} in parent ID: {}", name, parentId);
        Long targetParentId = resolveTargetId(parentId);

        validatePermission(
            targetParentId,
            ownerId,
            PrivilegeLevel.EDIT,
            "Access denied: You don't have permission to create folders here."
        );
        validateNameAvailability(name, targetParentId);

        Folder folder = Folder.builder()
            .name(name)
            .parentId(targetParentId)
            .ownerId(ownerId)
            .children(new ArrayList<>())
            .build();

        return folderPersistencePort.save(folder);
    }

    @Override
    @Transactional
    public Folder createFolderRecursive(String path, String ownerId) {
        log.info(
            "Creating recursive folders for path: {} and owner: {}",
            path,
            ownerId
        );
        if (path == null || path.isBlank()) return null;

        String[] parts = path.split("/");
        Long currentParentId = null;
        Folder lastFolder = null;

        for (String part : parts) {
            if (part.isBlank()) continue;
            Optional<Folder> existing = folderPersistencePort.findFolder(
                part,
                currentParentId,
                ownerId
            );
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
    public File uploadFile(
        InputStream inputStream,
        String name,
        String mime,
        Long size,
        Long parentId,
        String ownerId
    ) {
        log.info("Uploading file: {} for owner: {}", name, ownerId);
        Long targetParentId = resolveTargetId(parentId);

        validatePermission(
            targetParentId,
            ownerId,
            PrivilegeLevel.EDIT,
            "Access denied: You don't have permission to upload files here."
        );
        validateNameAvailability(name, targetParentId);

        String storageKey = UUID.randomUUID().toString();
        storageService.store(inputStream, storageKey);

        File file = File.builder()
            .name(name)
            .parentId(targetParentId)
            .ownerId(ownerId)
            .storageKey(storageKey)
            .mime(mime)
            .size(size)
            .build();

        return filePersistencePort.save(file);
    }

    @Override
    public InputStream downloadFile(Long nodeId, String ownerId) {
        log.info(
            "Downloading file with node ID: {} for owner: {}",
            nodeId,
            ownerId
        );
        validatePermission(
            nodeId,
            ownerId,
            PrivilegeLevel.VIEW,
            "Access denied: You don't have permission to download this file."
        );

        Storable storable = folderPersistencePort
            .findStorableById(nodeId)
            .orElseThrow(() ->
                new RuntimeException("File not found: " + nodeId)
            );

        if (storable instanceof File file) {
            return storageService.load(file.storageKey());
        }
        throw new RuntimeException("Cannot download a folder: " + nodeId);
    }

    @Override
    public Folder getHomeNode(String ownerId, String username) {
        log.info(
            "Retrieving home node for owner: {} and username: {}",
            ownerId,
            username
        );
        if (ADMIN_ID.equals(ownerId)) {
            return (Folder) folderPersistencePort
                .findStorableById(ROOT_ID)
                .orElseThrow();
        }

        String effectiveUsername = resolveUsername(ownerId, username);
        return folderPersistencePort
            .findFolder(effectiveUsername, ROOT_ID, ownerId)
            .orElseThrow(() ->
                new RuntimeException(
                    "Home folder not found for user: " + effectiveUsername
                )
            );
    }

    @Override
    public List<Storable> getPath(
        Long nodeId,
        String ownerId,
        String username
    ) {
        log.info("Retrieving path for node: {} and user: {}", nodeId, username);
        List<Storable> pathArr = new ArrayList<>();
        Long tempId = resolveTargetId(nodeId);

        while (tempId != null) {
            if (
                !sharingService.hasPermission(
                    tempId,
                    ownerId,
                    PrivilegeLevel.VIEW
                )
            ) break;

            final Long currentId = tempId;
            Storable node = folderPersistencePort
                .findStorableById(currentId)
                .orElseGet(() ->
                    currentId.equals(ROOT_ID)
                        ? folderPersistencePort
                              .findStorableByIdAndOwner(ROOT_ID, ADMIN_ID)
                              .orElse(null)
                        : null
                );

            if (node == null) break;
            pathArr.add(0, node);
            tempId = node.parentId();
        }

        return truncatePathForUser(pathArr, ownerId, username);
    }

    @Override
    @Transactional
    public void softDelete(Long nodeId, String ownerId) {
        log.info("Soft deleting node: {} for owner: {}", nodeId, ownerId);
        validatePermission(
            nodeId,
            ownerId,
            PrivilegeLevel.OWNER,
            "Access denied: You don't have permission to delete this node."
        );

        Storable node = folderPersistencePort
            .findStorableById(nodeId)
            .orElseThrow(() ->
                new RuntimeException("Node not found: " + nodeId)
            );

        if (ROOT_ID.equals(node.parentId())) {
            throw new RuntimeException(
                "Access denied: Cannot delete a root-level directory."
            );
        }

        folderPersistencePort.softDelete(nodeId, ownerId);
    }

    @Override
    @Transactional
    public void restore(Long nodeId, String ownerId) {
        log.info("Restoring node: {} for owner: {}", nodeId, ownerId);
        validatePermission(
            nodeId,
            ownerId,
            PrivilegeLevel.OWNER,
            "Access denied: You don't have permission to restore this node."
        );
        folderPersistencePort.restore(nodeId, ownerId);
    }

    @Override
    public List<TrashItem> getTrash(String ownerId) {
        log.info("Retrieving trash for owner: {}", ownerId);
        return folderPersistencePort
            .findTrash(ownerId)
            .stream()
            .map(this::toTrashItem)
            .toList();
    }

    @Override
    public List<TrashItem> getAllTrash() {
        log.info("Retrieving all trash for ADMIN");
        return folderPersistencePort
            .findAllTrash()
            .stream()
            .map(this::toTrashItem)
            .toList();
    }

    @Override
    @Transactional
    public void permanentlyDelete(Long nodeId, String ownerId) {
        log.info(
            "Permanently deleting node: {} for owner: {}",
            nodeId,
            ownerId
        );
        validatePermission(
            nodeId,
            ownerId,
            PrivilegeLevel.OWNER,
            "Access denied: You don't have permission to permanently delete this node."
        );
        folderPersistencePort.deleteById(nodeId, ownerId);
    }

    @Override
    @Transactional
    public void emptyTrash(String ownerId) {
        log.info("Emptying trash for owner: {}", ownerId);
        folderPersistencePort.emptyTrash(ownerId);
    }

    @Override
    public int getTrashRetentionDays() {
        return configService.getTrashRetentionDays();
    }

    @Override
    @Transactional
    public Storable rename(Long nodeId, String newName, String ownerId) {
        log.info(
            "Renaming node: {} to: {} for owner: {}",
            nodeId,
            newName,
            ownerId
        );
        validatePermission(
            nodeId,
            ownerId,
            PrivilegeLevel.EDIT,
            "Access denied: You don't have permission to rename this node."
        );

        Storable node = folderPersistencePort
            .findStorableById(nodeId)
            .orElseThrow(() ->
                new RuntimeException("Node not found: " + nodeId)
            );

        if (ROOT_ID.equals(node.parentId())) {
            throw new RuntimeException(
                "Access denied: Cannot rename root-level directories."
            );
        }

        String finalName = validateAndResolveNewName(node, newName);
        validateNameAvailability(finalName, node.parentId());

        return switch (node) {
            case File f -> filePersistencePort.save(
                new File(
                    f.id(),
                    finalName,
                    f.size(),
                    f.mime(),
                    f.storageKey(),
                    f.createdAt(),
                    f.modifiedAt(),
                    f.isDeleted(),
                    f.deletedAt(),
                    f.originalPath(),
                    f.isFavorite(),
                    f.ownerId(),
                    f.parentId()
                )
            );
            case Folder fol -> folderPersistencePort.save(
                new Folder(
                    fol.id(),
                    finalName,
                    fol.createdAt(),
                    fol.modifiedAt(),
                    fol.isDeleted(),
                    fol.deletedAt(),
                    fol.isFavorite(),
                    fol.ownerId(),
                    fol.parentId(),
                    fol.children()
                )
            );
        };
    }

    @Override
    @Transactional
    public File duplicate(Long nodeId, String newName, String ownerId) {
        log.info(
            "Duplicating node: {} with new name: {} for owner: {}",
            nodeId,
            newName,
            ownerId
        );
        validatePermission(
            nodeId,
            ownerId,
            PrivilegeLevel.VIEW,
            "Access denied: You don't have permission to duplicate this node."
        );

        Storable original = folderPersistencePort
            .findStorableById(nodeId)
            .orElseThrow(() ->
                new RuntimeException("Node not found: " + nodeId)
            );

        if (original instanceof Folder) {
            throw new RuntimeException(
                "Duplicating folders is not supported yet."
            );
        }

        File originalFile = (File) original;
        String finalName = resolveDuplicateName(originalFile, newName);
        String newStorageKey = UUID.randomUUID().toString();
        storageService.copy(originalFile.storageKey(), newStorageKey);

        File newFile = File.builder()
            .name(finalName)
            .parentId(originalFile.parentId())
            .ownerId(ownerId)
            .storageKey(newStorageKey)
            .mime(originalFile.mime())
            .size(originalFile.size())
            .build();

        return filePersistencePort.save(newFile);
    }

    @Override
    @Transactional
    public Storable move(Long nodeId, Long targetParentId, String ownerId) {
        log.info(
            "Moving node: {} to: {} for owner: {}",
            nodeId,
            targetParentId,
            ownerId
        );
        validatePermission(
            nodeId,
            ownerId,
            PrivilegeLevel.EDIT,
            "Access denied: You don't have permission to move this node."
        );
        validatePermission(
            targetParentId,
            ownerId,
            PrivilegeLevel.EDIT,
            "Access denied: You don't have permission to move items into the target folder."
        );

        Storable node = folderPersistencePort
            .findStorableById(nodeId)
            .orElseThrow(() ->
                new RuntimeException("Node not found: " + nodeId)
            );

        if (ROOT_ID.equals(node.parentId())) {
            throw new RuntimeException(
                "Access denied: Cannot move root-level directories."
            );
        }

        if (node instanceof Folder && isSubfolder(nodeId, targetParentId)) {
            throw new RuntimeException(
                "Cannot move a folder into its own subfolder."
            );
        }

        if (nodeId.equals(targetParentId)) {
            throw new RuntimeException("Cannot move a node to itself.");
        }

        return switch (node) {
            case File f -> filePersistencePort.save(
                new File(
                    f.id(),
                    f.name(),
                    f.size(),
                    f.mime(),
                    f.storageKey(),
                    f.createdAt(),
                    f.modifiedAt(),
                    f.isDeleted(),
                    f.deletedAt(),
                    f.originalPath(),
                    f.isFavorite(),
                    f.ownerId(),
                    targetParentId
                )
            );
            case Folder fol -> folderPersistencePort.save(
                new Folder(
                    fol.id(),
                    fol.name(),
                    fol.createdAt(),
                    fol.modifiedAt(),
                    fol.isDeleted(),
                    fol.deletedAt(),
                    fol.isFavorite(),
                    fol.ownerId(),
                    targetParentId,
                    fol.children()
                )
            );
        };
    }

    @Override
    public List<Storable> search(String query, String kind, String ownerId) {
        log.info(
            "Searching for nodes with query: {} and kind: {} for owner: {}",
            query,
            kind,
            ownerId
        );
        return ADMIN_ID.equals(ownerId)
            ? folderPersistencePort.searchGlobal(query, kind)
            : folderPersistencePort.search(query, kind, ownerId);
    }

    @Override
    public List<File> getRecentFiles(String ownerId) {
        log.info("Retrieving recent files for owner: {}", ownerId);
        return filePersistencePort.findRecent(ownerId);
    }

    @Override
    public List<Storable> getFavorites(String ownerId) {
        log.info("Retrieving favorites for owner: {}", ownerId);
        return folderPersistencePort.findFavorites(ownerId);
    }

    @Override
    @Transactional
    public Storable toggleFavorite(
        Long nodeId,
        boolean isFavorite,
        String ownerId
    ) {
        log.info(
            "Toggling favorite for node: {} to: {} for owner: {}",
            nodeId,
            isFavorite,
            ownerId
        );
        validatePermission(
            nodeId,
            ownerId,
            PrivilegeLevel.VIEW,
            "Access denied: You don't have permission to favorite this node."
        );

        return folderPersistencePort.toggleFavorite(
            nodeId,
            isFavorite,
            ownerId
        );
    }

    // Helper Methods (Atomic & Small)

    private Long resolveTargetId(Long nodeId) {
        return (nodeId == null || nodeId == 0) ? ROOT_ID : nodeId;
    }

    private void validatePermission(
        Long nodeId,
        String userId,
        PrivilegeLevel level,
        String errorMessage
    ) {
        if (!sharingService.hasPermission(nodeId, userId, level)) {
            throw new RuntimeException(errorMessage);
        }
    }

    private void validateNameAvailability(String name, Long parentId) {
        if (folderPersistencePort.existsByNameAndParent(name, parentId)) {
            throw new RuntimeException(
                "A file or folder with this name already exists."
            );
        }
    }

    private String resolveUsername(String ownerId, String username) {
        if (username != null) return username;
        return userPersistencePort
            .findById(ownerId)
            .map(User::username)
            .orElseThrow(() ->
                new RuntimeException("User not found: " + ownerId)
            );
    }

    private String validateAndResolveNewName(Storable node, String newName) {
        if (newName.matches(".*[\\\\/:*?\"<>|].*")) {
            throw new RuntimeException("Filename contains invalid characters.");
        }

        if (node instanceof File file) {
            String originalName = file.name();
            int lastDotIndex = originalName.lastIndexOf('.');
            if (lastDotIndex != -1) {
                String extension = originalName.substring(lastDotIndex);
                int newLastDotIndex = newName.lastIndexOf('.');
                String baseName = (newLastDotIndex != -1)
                    ? newName.substring(0, newLastDotIndex)
                    : newName;
                return baseName + extension;
            }
        }
        return newName;
    }

    private String resolveDuplicateName(File original, String newName) {
        if (newName != null && !newName.isBlank()) {
            String resolved = validateAndResolveNewName(original, newName);
            validateNameAvailability(resolved, original.parentId());
            return resolved;
        }

        String originalName = original.name();
        int lastDotIndex = originalName.lastIndexOf('.');
        String extension = (lastDotIndex != -1)
            ? originalName.substring(lastDotIndex)
            : "";
        String baseName = (lastDotIndex != -1)
            ? originalName.substring(0, lastDotIndex)
            : originalName;

        String finalName = originalName;
        int counter = 1;
        while (
            folderPersistencePort.existsByNameAndParent(
                finalName,
                original.parentId()
            )
        ) {
            finalName = baseName + " " + counter + extension;
            counter++;
        }
        return finalName;
    }

    private boolean isSubfolder(Long folderId, Long targetParentId) {
        if (
            targetParentId == null ||
            targetParentId == 0 ||
            ROOT_ID.equals(targetParentId)
        ) return false;
        if (folderId.equals(targetParentId)) return true;

        Long currentId = targetParentId;
        while (currentId != null && !ROOT_ID.equals(currentId)) {
            Optional<Storable> parent = folderPersistencePort.findStorableById(
                currentId
            );
            if (parent.isEmpty()) break;
            currentId = parent.get().parentId();
            if (folderId.equals(currentId)) return true;
        }
        return false;
    }

    private TrashItem toTrashItem(Storable storable) {
        long daysRemaining = 0;
        if (storable.deletedAt() != null) {
            LocalDateTime expiryDate = storable
                .deletedAt()
                .plusDays(configService.getTrashRetentionDays());
            daysRemaining = ChronoUnit.DAYS.between(
                LocalDateTime.now(ZoneOffset.UTC),
                expiryDate
            );
            if (daysRemaining < 0) daysRemaining = 0;
        }
        return new TrashItem(storable, daysRemaining);
    }

    private List<Storable> truncatePathForUser(
        List<Storable> pathArr,
        String ownerId,
        String username
    ) {
        if (ADMIN_ID.equals(ownerId)) return pathArr;

        String effectiveUsername = resolveUsername(ownerId, username);
        int homeIndex = -1;
        for (int i = 0; i < pathArr.size(); i++) {
            Storable node = pathArr.get(i);
            if (
                effectiveUsername.equals(node.name()) &&
                ROOT_ID.equals(node.parentId())
            ) {
                homeIndex = i;
                break;
            }
        }

        return (homeIndex != -1)
            ? pathArr.subList(homeIndex + 1, pathArr.size())
            : pathArr;
    }
}
