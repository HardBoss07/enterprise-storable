package dev.m4tt3o.storable.data.mapper;

import dev.m4tt3o.storable.core.domain.File;
import dev.m4tt3o.storable.core.domain.Folder;
import dev.m4tt3o.storable.core.domain.Storable;
import dev.m4tt3o.storable.data.entity.FileEntity;
import dev.m4tt3o.storable.data.entity.FolderEntity;
import dev.m4tt3o.storable.data.entity.NodeEntity;
import java.util.ArrayList;

/**
 * Mapper for converting between Node Entities and Domain Records.
 * Uses Java 21 Pattern Matching for switch.
 */
public class NodeMapper {

    /** Maps a NodeEntity subclass to its corresponding Storable record. */
    public static Storable toDomain(NodeEntity entity) {
        if (entity == null) return null;

        return switch (entity) {
            case FileEntity f -> File.builder()
                .id(f.getId())
                .name(f.getName())
                .size(f.getSize())
                .mime(f.getMime())
                .storageKey(f.getStorageKey())
                .createdAt(f.getCreatedAt())
                .modifiedAt(f.getModifiedAt())
                .isDeleted(f.isDeleted())
                .deletedAt(f.getDeletedAt())
                .originalPath(f.getOriginalPath())
                .isFavorite(f.isFavorite())
                .ownerId(f.getOwnerId())
                .parentId(f.getParentId())
                .build();
            case FolderEntity fol -> Folder.builder()
                .id(fol.getId())
                .name(fol.getName())
                .createdAt(fol.getCreatedAt())
                .modifiedAt(fol.getModifiedAt())
                .isDeleted(fol.isDeleted())
                .deletedAt(fol.getDeletedAt())
                .isFavorite(fol.isFavorite())
                .ownerId(fol.getOwnerId())
                .parentId(fol.getParentId())
                .children(new ArrayList<>()) // Children populated separately if needed
                .build();
            default -> throw new IllegalArgumentException(
                "Unknown node type: " + entity.getClass()
            );
        };
    }

    /** Maps a File domain record to a FileEntity. */
    public static FileEntity toEntity(File file) {
        if (file == null) return null;

        return FileEntity.builder()
            .id(file.id())
            .name(file.name())
            .size(file.size())
            .mime(file.mime())
            .storageKey(file.storageKey())
            .createdAt(file.createdAt())
            .modifiedAt(file.modifiedAt())
            .isDeleted(file.isDeleted())
            .deletedAt(file.deletedAt())
            .originalPath(file.originalPath())
            .isFavorite(file.isFavorite())
            .ownerId(file.ownerId())
            .parentId(file.parentId())
            .build();
    }

    /** Maps a Folder domain record to a FolderEntity. */
    public static FolderEntity toEntity(Folder folder) {
        if (folder == null) return null;

        return FolderEntity.builder()
            .id(folder.id())
            .name(folder.name())
            .createdAt(folder.createdAt())
            .modifiedAt(folder.modifiedAt())
            .isDeleted(folder.isDeleted())
            .deletedAt(folder.deletedAt())
            .isFavorite(folder.isFavorite())
            .ownerId(folder.ownerId())
            .parentId(folder.parentId())
            .build();
    }
}
