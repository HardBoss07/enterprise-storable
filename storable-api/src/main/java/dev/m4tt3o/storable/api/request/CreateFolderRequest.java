package dev.m4tt3o.storable.api.request;

/**
 * Request record for creating a new folder.
 */
public record CreateFolderRequest(
    String name,
    Long parentId
) {}
