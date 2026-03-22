package dev.m4tt3o.storable.core.domain;

import java.time.LocalDateTime;
import java.util.SequencedCollection;
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
    Long parentId,
    SequencedCollection<Storable> children
) implements Storable {
    // Note: Record getters are automatically name() and id() etc.
}
