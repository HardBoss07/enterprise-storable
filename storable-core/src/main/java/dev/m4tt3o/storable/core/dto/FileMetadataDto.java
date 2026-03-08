package dev.m4tt3o.storable.core.dto;

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
    LocalDateTime deletedAt,
    String ownerId,
    Long parentId,
    boolean folder
) {}
