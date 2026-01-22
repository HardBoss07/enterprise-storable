package dev.m4tt3o.storable.core.dto;

import lombok.Data;
import java.time.OffsetDateTime;

@Data
public class FileMetadataDto {
    private String id;
    private String name;
    private long size;
    private OffsetDateTime createdAt;
    private OffsetDateTime modifiedAt;
    private String ownerId;
    private String parentId;
    private boolean isFolder;
}
