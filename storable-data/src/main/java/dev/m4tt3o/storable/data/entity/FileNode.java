package dev.m4tt3o.storable.data.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;

import java.time.OffsetDateTime;

@Data
@Entity
@Table(name = "nodes")
public class FileNode {
    @Id
    private String id;
    private String name;
    private long size;
    private OffsetDateTime createdAt;
    private OffsetDateTime modifiedAt;
    private String ownerId;
    private String parentId;
    private boolean isFolder;
}
