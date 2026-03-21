package dev.m4tt3o.storable.core.service;

import dev.m4tt3o.storable.core.domain.File;
import dev.m4tt3o.storable.core.domain.Folder;
import dev.m4tt3o.storable.core.domain.Storable;
import dev.m4tt3o.storable.core.domain.TrashItem;
import java.io.InputStream;
import java.util.List;

/**
 * Interface for business logic operations related to files and folders.
 * Returns pure domain records (File, Folder, Storable).
 */
public interface FileService {
    /** Retrieves children of a given node for a specific owner. */
    List<Storable> getChildren(Long nodeId, String ownerId);

    /** Retrieves metadata for a specific node for a specific owner. */
    Storable getMetadata(Long nodeId, String ownerId);

    /** Calculates the total size of all files for an owner. */
    long getTotalSize(String ownerId);

    /** Creates a new folder. */
    Folder createFolder(String name, Long parentId, String ownerId);

    /** Creates folders recursively for a given path. */
    Folder createFolderRecursive(String path, String ownerId);

    /** Uploads a file and stores its metadata. */
    File uploadFile(
        InputStream inputStream,
        String name,
        String mime,
        Long size,
        Long parentId,
        String ownerId
    );

    /** Retrieves an input stream for downloading a file for a specific owner. */
    InputStream downloadFile(Long nodeId, String ownerId);

    /** Retrieves the home folder for a specific user. */
    Folder getHomeNode(String ownerId, String username);

    /** Retrieves the path (breadcrumbs) for a specific node, virtualized for the user. */
    List<Storable> getPath(Long nodeId, String ownerId, String username);

    /** Soft deletes a node. */
    void softDelete(Long nodeId, String ownerId);

    /** Restores a soft-deleted node. */
    void restore(Long nodeId, String ownerId);

    /** Retrieves all soft-deleted nodes for an owner. */
    List<TrashItem> getTrash(String ownerId);

    /** Retrieves all soft-deleted nodes (for ADMIN). */
    List<TrashItem> getAllTrash();

    /** Permanently deletes a node. */
    void permanentlyDelete(Long nodeId, String ownerId);

    /** Permanently deletes all nodes in trash for an owner. */
    void emptyTrash(String ownerId);

    /** Retrieves the global trash retention days. */
    int getTrashRetentionDays();

    /** Renames a file or folder. */
    Storable rename(Long nodeId, String newName, String ownerId);

    /** Creates a duplicate of a file with an optional new name. */
    File duplicate(Long nodeId, String newName, String ownerId);

    /** Moves a file or folder to a new destination. */
    Storable move(Long nodeId, Long targetParentId, String ownerId);

    /** Searches for nodes by name and kind for a specific owner. */
    List<Storable> search(String query, String kind, String ownerId);

    /** Retrieves the 5 most recently modified files for a specific owner. */
    List<File> getRecentFiles(String ownerId);

    /** Retrieves all favorite nodes for a specific owner. */
    List<Storable> getFavorites(String ownerId);

    /** Toggles the favorite status of a node. */
    Storable toggleFavorite(Long nodeId, boolean isFavorite, String ownerId);
}
