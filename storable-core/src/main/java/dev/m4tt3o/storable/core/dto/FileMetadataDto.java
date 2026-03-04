package dev.m4tt3o.storable.core.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class FileMetadataDto {
    private Long id;
    private String name;
    private Long size;
    private String mime;
    private String storageKey;
    private LocalDateTime createdAt;
    private LocalDateTime modifiedAt;
    private LocalDateTime deletedAt;
    private String ownerId;
    private Long parentId;
    private boolean folder;
}
