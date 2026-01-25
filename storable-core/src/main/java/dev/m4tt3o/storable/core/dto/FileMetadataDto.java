package dev.m4tt3o.storable.core.dto;

import lombok.Data;
import java.time.OffsetDateTime;

@Data
public class FileMetadataDto {
    private long id;
    private String name;
    private String path;
    private Long size;
    private OffsetDateTime createdAt;
    private OffsetDateTime modifiedAt;
    private long ownerId;
    private Long parentId;
    private boolean isFolder;
}
