package dev.m4tt3o.storable.core.domain;

import java.time.LocalDateTime;
import lombok.Builder;

/**
 * Pure Java Domain Model for a File, implemented as a Record.
 */
@Builder
public record File(
    Long id,
    String name,
    Long size,
    String mime,
    String storageKey,
    LocalDateTime createdAt,
    LocalDateTime modifiedAt,
    boolean isDeleted,
    LocalDateTime deletedAt,
    String originalPath,
    boolean isFavorite,
    String ownerId,
    Long parentId
) implements Storable {
    public File withName(String newName) {
        return new File(
            id,
            newName,
            size,
            mime,
            storageKey,
            createdAt,
            modifiedAt,
            isDeleted,
            deletedAt,
            originalPath,
            isFavorite,
            ownerId,
            parentId
        );
    }

    public File withParentId(Long newParentId) {
        return new File(
            id,
            name,
            size,
            mime,
            storageKey,
            createdAt,
            modifiedAt,
            isDeleted,
            deletedAt,
            originalPath,
            isFavorite,
            ownerId,
            newParentId
        );
    }
}
