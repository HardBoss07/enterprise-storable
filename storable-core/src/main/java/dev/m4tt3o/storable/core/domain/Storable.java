package dev.m4tt3o.storable.core.domain;

import java.time.LocalDateTime;

/**
 * Pure Java Domain Model for any storable item (File or Folder).
 * Represented as a sealed interface for exhaustive pattern matching.
 */
public sealed interface Storable permits File, Folder {
    Long id();
    String name();
    Long parentId();
    String ownerId();
    LocalDateTime createdAt();
    LocalDateTime modifiedAt();
    boolean isDeleted();
    LocalDateTime deletedAt();
    boolean isFavorite();
}
