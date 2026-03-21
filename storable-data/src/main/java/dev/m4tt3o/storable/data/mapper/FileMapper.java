package dev.m4tt3o.storable.data.mapper;

import dev.m4tt3o.storable.core.domain.File;
import dev.m4tt3o.storable.core.domain.Folder;
import dev.m4tt3o.storable.core.domain.Storable;
import dev.m4tt3o.storable.data.entity.FileEntity;
import lombok.experimental.UtilityClass;

@UtilityClass
public class FileMapper {

    public static Storable toDomain(FileEntity entity) {
        if (entity == null) return null;

        return switch (entity.getKind()) {
            case file -> toFile(entity);
            case folder -> toFolder(entity);
        };
    }

    public static File toFile(FileEntity entity) {
        if (
            entity == null || entity.getKind() != FileEntity.NodeKind.file
        ) return null;

        return File.builder()
            .id(entity.getId())
            .name(entity.getName())
            .size(entity.getSize())
            .mime(entity.getMime())
            .storageKey(entity.getStorageKey())
            .createdAt(entity.getCreatedAt())
            .modifiedAt(entity.getModifiedAt())
            .isDeleted(entity.isDeleted())
            .deletedAt(entity.getDeletedAt())
            .originalPath(entity.getOriginalPath())
            .isFavorite(entity.isFavorite())
            .ownerId(entity.getOwnerId())
            .parentId(entity.getParentId())
            .build();
    }

    public static Folder toFolder(FileEntity entity) {
        if (
            entity == null || entity.getKind() != FileEntity.NodeKind.folder
        ) return null;

        return Folder.builder()
            .id(entity.getId())
            .name(entity.getName())
            .createdAt(entity.getCreatedAt())
            .modifiedAt(entity.getModifiedAt())
            .isDeleted(entity.isDeleted())
            .deletedAt(entity.getDeletedAt())
            .isFavorite(entity.isFavorite())
            .ownerId(entity.getOwnerId())
            .parentId(entity.getParentId())
            .build();
    }

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
            .kind(FileEntity.NodeKind.file)
            .build();
    }

    public static FileEntity toEntity(Folder folder) {
        if (folder == null) return null;

        return FileEntity.builder()
            .id(folder.id())
            .name(folder.name())
            .createdAt(folder.createdAt())
            .modifiedAt(folder.modifiedAt())
            .isDeleted(folder.isDeleted())
            .deletedAt(folder.deletedAt())
            .isFavorite(folder.isFavorite())
            .ownerId(folder.ownerId())
            .parentId(folder.parentId())
            .kind(FileEntity.NodeKind.folder)
            .build();
    }

    public static FileEntity toEntity(Storable storable) {
        if (storable == null) return null;
        if (storable instanceof File file) return toEntity(file);
        if (storable instanceof Folder folder) return toEntity(folder);
        return null;
    }
}
