package dev.m4tt3o.storable.common.dto;

/**
 * Metadata DTO for items in the trash, including days remaining until permanent deletion.
 */
public record TrashMetadataDto(
    FileMetadataDto metadata,
    long daysRemaining
) {}
