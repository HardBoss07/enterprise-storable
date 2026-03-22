package dev.m4tt3o.storable.core.port;

import dev.m4tt3o.storable.core.domain.File;
import java.util.List;
import java.util.Optional;

/**
 * Port (Outbound) for File-specific persistence operations.
 */
public interface FilePersistencePort {
    /** Finds a file by its ID. */
    Optional<File> findById(Long id);

    /** Finds a file by its ID and owner. */
    Optional<File> findByIdAndOwner(Long id, String ownerId);

    /** Saves a File record. */
    File save(File file);

    /** Deletes a file by its ID and owner. */
    void deleteById(Long id, String ownerId);

    /** Finds the recently modified files for an owner. */
    List<File> findRecent(String ownerId);

    /** Calculates total size of all files for an owner. */
    long sumSizeByOwner(String ownerId);
}
