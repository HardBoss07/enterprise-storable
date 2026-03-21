package dev.m4tt3o.storable.core.domain;

import java.time.LocalDateTime;
import lombok.Builder;

/**
 * Pure Java Domain Model for a Folder, implemented as a Record.
 */
@Builder
public record Folder(
    Long id,
    String name,
    LocalDateTime createdAt,
    LocalDateTime modifiedAt,
    boolean isDeleted,
    LocalDateTime deletedAt,
    boolean isFavorite,
    String ownerId,
    Long parentId
) implements Storable {
    public Folder withName(String newName) {
        return new Folder(
            id,
            newName,
            createdAt,
            modifiedAt,
            isDeleted,
            deletedAt,
            isFavorite,
            ownerId,
            parentId
        );
    }

    public Folder withParentId(Long newParentId) {
        return new Folder(
            id,
            name,
            createdAt,
            modifiedAt,
            isDeleted,
            deletedAt,
            isFavorite,
            ownerId,
            newParentId
        );
    }
}
