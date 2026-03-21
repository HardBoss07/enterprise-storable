package dev.m4tt3o.storable.core.port;

import dev.m4tt3o.storable.core.domain.File;
import dev.m4tt3o.storable.core.domain.Folder;
import dev.m4tt3o.storable.core.domain.Storable;
import java.util.List;
import java.util.Optional;

/**
 * Port (Outbound) for File and Folder persistence operations.
 */
public interface FilePersistencePort {
    /** Finds any storable item (File or Folder) by its ID. */
    Optional<Storable> findById(Long id);

    /** Finds an item by its ID and owner. */
    Optional<Storable> findByIdAndOwner(Long id, String ownerId);

    /** Finds multiple items by their IDs. */
    List<Storable> findByIds(List<Long> ids);

    /** Retrieves all children of a parent node for an owner. */
    List<Storable> findChildren(Long parentId, String ownerId);

    /** Retrieves all children of a parent node globally. */
    List<Storable> findChildrenGlobal(Long parentId);

    /** Finds all items belonging to a specific owner. */
    List<Storable> findByOwnerId(String ownerId);

    /** Saves a Folder record. */
    Folder saveFolder(Folder folder);

    /** Saves a File record. */
    File saveFile(File file);

    /** Deletes an item by its ID and owner. */
    void deleteById(Long id, String ownerId);

    /** Soft deletes an item and its children. */
    void softDelete(Long id, String ownerId);

    /** Restores an item and its children. */
    void restore(Long id, String ownerId);

    /** Finds all items in trash for an owner. */
    List<Storable> findTrash(String ownerId);

    /** Finds all items in trash globally. */
    List<Storable> findAllTrash();

    /** Permanently deletes all items in trash for an owner. */
    void emptyTrash(String ownerId);

    /** Finds the 5 most recently modified files for an owner. */
    List<File> findRecentFiles(String ownerId);

    /** Finds all favorite items for an owner. */
    List<Storable> findFavorites(String ownerId);

    /** Calculates total size of all files for an owner. */
    long sumSizeByOwnerId(String ownerId);

    /** Toggles the favorite status of an item. */
    Storable toggleFavorite(Long id, boolean isFavorite, String ownerId);

    /** Searches for items for an owner. */
    List<Storable> search(String query, String kind, String ownerId);

    /** Searches for items globally. */
    List<Storable> searchGlobal(String query, String kind);

    /** Finds a folder by name, parent, and owner. */
    Optional<Folder> findFolder(String name, Long parentId, String ownerId);

    /** Checks if an item exists by name and parent globally. */
    boolean existsByNameAndParentGlobal(String name, Long parentId);
}
