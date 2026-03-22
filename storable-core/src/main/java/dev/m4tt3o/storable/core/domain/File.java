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
    // Note: Record getters are automatically name() and id() etc.
}
