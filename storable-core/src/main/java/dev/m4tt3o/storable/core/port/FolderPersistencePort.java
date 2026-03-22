package dev.m4tt3o.storable.core.port;

import dev.m4tt3o.storable.core.domain.Folder;
import dev.m4tt3o.storable.core.domain.Storable;
import java.util.List;
import java.util.Optional;
import java.util.SequencedCollection;

/**
 * Port (Outbound) for Folder and general Storable persistence operations.
 */
public interface FolderPersistencePort {
    /** Finds any storable item (File or Folder) by its ID. */
    Optional<Storable> findStorableById(Long id);

    /** Finds an item by its ID and owner. */
    Optional<Storable> findStorableByIdAndOwner(Long id, String ownerId);

    /** Finds multiple items by their IDs. */
    List<Storable> findStorableByIds(List<Long> ids);

    /** Finds all items belonging to a specific owner. */
    List<Storable> findStorableByOwnerId(String ownerId);

    /** Retrieves all children of a parent node globally. */
    SequencedCollection<Storable> findChildren(Long parentId);

    /** Saves a Folder record. */
    Folder save(Folder folder);

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

    /** Finds a folder by name, parent, and owner. */
    Optional<Folder> findFolder(String name, Long parentId, String ownerId);

    /** Checks if an item exists by name and parent globally. */
    boolean existsByNameAndParent(String name, Long parentId);

    /** Searches for items for an owner. */
    List<Storable> search(String query, String kind, String ownerId);

    /** Searches for items globally. */
    List<Storable> searchGlobal(String query, String kind);

    /** Toggles favorite status. */
    Storable toggleFavorite(Long id, boolean isFavorite, String ownerId);

    /** Finds favorites for an owner. */
    List<Storable> findFavorites(String ownerId);
}
