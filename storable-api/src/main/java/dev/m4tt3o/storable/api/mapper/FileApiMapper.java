package dev.m4tt3o.storable.api.mapper;

import dev.m4tt3o.storable.common.dto.FileMetadataDto;
import dev.m4tt3o.storable.common.dto.TrashMetadataDto;
import dev.m4tt3o.storable.common.entity.PrivilegeLevel;
import dev.m4tt3o.storable.core.domain.File;
import dev.m4tt3o.storable.core.domain.Folder;
import dev.m4tt3o.storable.core.domain.Storable;
import dev.m4tt3o.storable.core.domain.TrashItem;
import dev.m4tt3o.storable.core.service.SharingService;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class FileApiMapper {

    private final SharingService sharingService;

    public FileMetadataDto toDto(Storable storable, String userId) {
        if (storable == null) return null;

        PrivilegeLevel privilege = sharingService.getHighestPrivilege(
            storable.id(),
            userId
        );

        return switch (storable) {
            case File f -> toFileDto(f, privilege);
            case Folder fol -> toFolderDto(fol, privilege);
        };
    }

    private FileMetadataDto toFileDto(File f, PrivilegeLevel privilege) {
        return new FileMetadataDto(
            f.id(),
            f.name(),
            f.size(),
            f.mime(),
            f.storageKey(),
            f.createdAt(),
            f.modifiedAt(),
            f.isDeleted(),
            f.deletedAt(),
            f.originalPath(),
            f.isFavorite(),
            f.ownerId(),
            f.parentId(),
            false,
            privilege
        );
    }

    private FileMetadataDto toFolderDto(Folder fol, PrivilegeLevel privilege) {
        return new FileMetadataDto(
            fol.id(),
            fol.name(),
            null,
            "directory",
            null,
            fol.createdAt(),
            fol.modifiedAt(),
            fol.isDeleted(),
            fol.deletedAt(),
            null,
            fol.isFavorite(),
            fol.ownerId(),
            fol.parentId(),
            true,
            privilege
        );
    }

    public List<FileMetadataDto> toDtoList(
        List<Storable> storables,
        String userId
    ) {
        return storables
            .stream()
            .map(s -> toDto(s, userId))
            .toList();
    }

    public TrashMetadataDto toTrashDto(TrashItem trashItem, String userId) {
        return new TrashMetadataDto(
            toDto(trashItem.item(), userId),
            trashItem.daysRemaining()
        );
    }

    public List<TrashMetadataDto> toTrashDtoList(
        List<TrashItem> trashItems,
        String userId
    ) {
        return trashItems
            .stream()
            .map(ti -> toTrashDto(ti, userId))
            .toList();
    }
}
