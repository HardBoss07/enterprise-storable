package dev.m4tt3o.storable.data.adapter;

import dev.m4tt3o.storable.core.domain.File;
import dev.m4tt3o.storable.core.domain.Folder;
import dev.m4tt3o.storable.core.domain.Storable;
import dev.m4tt3o.storable.core.port.FilePersistencePort;
import dev.m4tt3o.storable.data.entity.FileEntity;
import dev.m4tt3o.storable.data.mapper.FileMapper;
import dev.m4tt3o.storable.data.repository.FileRepository;
import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.util.List;
import java.util.Optional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Component
@RequiredArgsConstructor
public class FilePersistenceAdapter implements FilePersistencePort {

    private final FileRepository fileRepository;

    @Override
    public Optional<Storable> findById(Long id) {
        return fileRepository.findById(id).map(FileMapper::toDomain);
    }

    @Override
    public Optional<Storable> findByIdAndOwner(Long id, String ownerId) {
        return fileRepository
            .findByIdAndAuthorizedOwner(id, ownerId)
            .map(FileMapper::toDomain);
    }

    @Override
    public List<Storable> findByIds(List<Long> ids) {
        return fileRepository
            .findAllById(ids)
            .stream()
            .map(FileMapper::toDomain)
            .toList();
    }

    @Override
    public List<Storable> findChildren(Long parentId, String ownerId) {
        Long targetParentId = (parentId == null || parentId == 0)
            ? 1L
            : parentId;
        return fileRepository
            .findByParentIdAndAuthorizedOwner(targetParentId, ownerId)
            .stream()
            .map(FileMapper::toDomain)
            .toList();
    }

    @Override
    public List<Storable> findChildrenGlobal(Long parentId) {
        Long targetParentId = (parentId == null || parentId == 0)
            ? 1L
            : parentId;
        return fileRepository
            .findByParentIdAndIsDeletedFalse(targetParentId)
            .stream()
            .map(FileMapper::toDomain)
            .toList();
    }

    @Override
    public List<Storable> findByOwnerId(String ownerId) {
        return fileRepository
            .findByOwnerId(ownerId)
            .stream()
            .map(FileMapper::toDomain)
            .toList();
    }

    @Override
    @Transactional
    public Folder saveFolder(Folder folder) {
        FileEntity entity = FileMapper.toEntity(folder);
        return FileMapper.toFolder(fileRepository.save(entity));
    }

    @Override
    @Transactional
    public File saveFile(File file) {
        FileEntity entity = FileMapper.toEntity(file);
        return FileMapper.toFile(fileRepository.save(entity));
    }

    @Override
    @Transactional
    public void deleteById(Long id, String ownerId) {
        fileRepository
            .findByIdAndAuthorizedOwnerIncludingDeleted(id, ownerId)
            .ifPresent(entity -> {
                if (entity.getKind() == FileEntity.NodeKind.folder) {
                    permanentlyDeleteChildren(entity.getId());
                }
                fileRepository.delete(entity);
            });
    }

    private void permanentlyDeleteChildren(Long parentId) {
        List<FileEntity> children = fileRepository.findByParentId(parentId);
        for (FileEntity child : children) {
            if (child.getKind() == FileEntity.NodeKind.folder) {
                permanentlyDeleteChildren(child.getId());
            }
            fileRepository.delete(child);
        }
    }

    @Override
    @Transactional
    public void softDelete(Long id, String ownerId) {
        fileRepository
            .findByIdAndAuthorizedOwner(id, ownerId)
            .ifPresent(entity -> {
                entity.setDeleted(true);
                entity.setDeletedAt(LocalDateTime.now(ZoneOffset.UTC));
                fileRepository.save(entity);
                softDeleteChildren(entity.getId());
            });
    }

    private void softDeleteChildren(Long parentId) {
        List<FileEntity> children = fileRepository.findByParentId(parentId);
        for (FileEntity child : children) {
            if (!child.isDeleted()) {
                child.setDeleted(true);
                child.setDeletedAt(LocalDateTime.now(ZoneOffset.UTC));
                fileRepository.save(child);
                if (child.getKind() == FileEntity.NodeKind.folder) {
                    softDeleteChildren(child.getId());
                }
            }
        }
    }

    @Override
    @Transactional
    public void restore(Long id, String ownerId) {
        fileRepository
            .findByIdAndAuthorizedOwnerIncludingDeleted(id, ownerId)
            .ifPresent(entity -> {
                entity.setDeleted(false);
                entity.setDeletedAt(null);
                fileRepository.save(entity);
                restoreChildren(entity.getId());
            });
    }

    private void restoreChildren(Long parentId) {
        List<FileEntity> children = fileRepository.findByParentId(parentId);
        for (FileEntity child : children) {
            if (child.isDeleted()) {
                child.setDeleted(false);
                child.setDeletedAt(null);
                fileRepository.save(child);
                if (child.getKind() == FileEntity.NodeKind.folder) {
                    restoreChildren(child.getId());
                }
            }
        }
    }

    @Override
    public List<Storable> findTrash(String ownerId) {
        return fileRepository
            .findByOwnerIdAndIsDeletedTrue(ownerId)
            .stream()
            .map(FileMapper::toDomain)
            .toList();
    }

    @Override
    public List<Storable> findAllTrash() {
        return fileRepository
            .findAllDeleted()
            .stream()
            .map(FileMapper::toDomain)
            .toList();
    }

    @Override
    @Transactional
    public void emptyTrash(String ownerId) {
        List<FileEntity> trash = fileRepository.findByOwnerIdAndIsDeletedTrue(
            ownerId
        );
        for (FileEntity entity : trash) {
            if (entity.getKind() == FileEntity.NodeKind.folder) {
                permanentlyDeleteChildren(entity.getId());
            }
            fileRepository.delete(entity);
        }
    }

    @Override
    public List<File> findRecentFiles(String ownerId) {
        return fileRepository
            .findTop5ByOwnerIdAndKindAndIsDeletedFalseOrderByModifiedAtDesc(
                ownerId,
                FileEntity.NodeKind.file
            )
            .stream()
            .map(FileMapper::toFile)
            .toList();
    }

    @Override
    public List<Storable> findFavorites(String ownerId) {
        return fileRepository
            .findByOwnerIdAndIsFavoriteTrueAndIsDeletedFalse(ownerId)
            .stream()
            .map(FileMapper::toDomain)
            .toList();
    }

    @Override
    public long sumSizeByOwnerId(String ownerId) {
        return fileRepository.sumSizeByOwnerId(
            ownerId,
            FileEntity.NodeKind.file
        );
    }

    @Override
    @Transactional
    public Storable toggleFavorite(
        Long id,
        boolean isFavorite,
        String ownerId
    ) {
        return fileRepository
            .findByIdAndAuthorizedOwner(id, ownerId)
            .map(entity -> {
                entity.setFavorite(isFavorite);
                return FileMapper.toDomain(fileRepository.save(entity));
            })
            .orElseThrow(() ->
                new RuntimeException("Node not found or access denied: " + id)
            );
    }

    @Override
    public List<Storable> search(String query, String kind, String ownerId) {
        FileEntity.NodeKind nodeKind = parseKind(kind);
        return fileRepository
            .search(query, nodeKind, ownerId)
            .stream()
            .map(FileMapper::toDomain)
            .toList();
    }

    @Override
    public List<Storable> searchGlobal(String query, String kind) {
        FileEntity.NodeKind nodeKind = parseKind(kind);
        return fileRepository
            .searchGlobal(query, nodeKind)
            .stream()
            .map(FileMapper::toDomain)
            .toList();
    }

    @Override
    public Optional<Folder> findFolder(
        String name,
        Long parentId,
        String ownerId
    ) {
        if (parentId == null) {
            return fileRepository
                .findByOwnerIdAndParentIdIsNullAndNameAndKindAndIsDeletedFalse(
                    ownerId,
                    name,
                    FileEntity.NodeKind.folder
                )
                .map(FileMapper::toFolder);
        }
        return fileRepository
            .findByOwnerIdAndParentIdAndNameAndKindAndIsDeletedFalse(
                ownerId,
                parentId,
                name,
                FileEntity.NodeKind.folder
            )
            .map(FileMapper::toFolder);
    }

    @Override
    public boolean existsByNameAndParentGlobal(String name, Long parentId) {
        return fileRepository
            .findByNameAndParentIdGlobal(name, parentId)
            .isPresent();
    }

    private FileEntity.NodeKind parseKind(String kind) {
        if (kind == null) return null;
        try {
            return FileEntity.NodeKind.valueOf(kind.toLowerCase());
        } catch (IllegalArgumentException e) {
            return null;
        }
    }
}
