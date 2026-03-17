package dev.m4tt3o.storable.common.dto;

import java.time.LocalDateTime;

/**
 * Immutable Data Transfer Object for File Node metadata.
 */
public record FileMetadataDto(
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
    Long parentId,
    boolean folder
) {}
