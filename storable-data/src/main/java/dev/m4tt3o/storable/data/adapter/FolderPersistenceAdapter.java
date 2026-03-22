package dev.m4tt3o.storable.data.adapter;

import dev.m4tt3o.storable.core.domain.Folder;
import dev.m4tt3o.storable.core.domain.Storable;
import dev.m4tt3o.storable.core.port.FolderPersistencePort;
import dev.m4tt3o.storable.data.entity.FolderEntity;
import dev.m4tt3o.storable.data.entity.NodeEntity;
import dev.m4tt3o.storable.data.mapper.NodeMapper;
import dev.m4tt3o.storable.data.repository.FolderRepository;
import dev.m4tt3o.storable.data.repository.NodeRepository;
import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.util.List;
import java.util.Optional;
import java.util.SequencedCollection;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

/**
 * Adapter for Folder and general Storable persistence operations.
 */
@Component
@RequiredArgsConstructor
public class FolderPersistenceAdapter implements FolderPersistencePort {

    private final FolderRepository folderRepository;
    private final NodeRepository nodeRepository;

    @Override
    public Optional<Storable> findStorableById(Long id) {
        return nodeRepository.findById(id).map(NodeMapper::toDomain);
    }

    @Override
    public Optional<Storable> findStorableByIdAndOwner(
        Long id,
        String ownerId
    ) {
        return nodeRepository
            .findByIdAndOwnerId(id, ownerId)
            .map(NodeMapper::toDomain);
    }

    @Override
    public List<Storable> findStorableByIds(List<Long> ids) {
        return nodeRepository
            .findAllById(ids)
            .stream()
            .map(NodeMapper::toDomain)
            .toList();
    }

    @Override
    public List<Storable> findStorableByOwnerId(String ownerId) {
        return nodeRepository
            .findByOwnerId(ownerId)
            .stream()
            .map(NodeMapper::toDomain)
            .toList();
    }

    @Override
    public SequencedCollection<Storable> findChildren(Long parentId) {
        return nodeRepository
            .findByParentIdAndIsDeletedFalse(parentId)
            .stream()
            .map(NodeMapper::toDomain)
            .collect(
                java.util.stream.Collectors.toCollection(
                    java.util.ArrayList::new
                )
            );
    }

    @Override
    @Transactional
    public Folder save(Folder folder) {
        FolderEntity entity = NodeMapper.toEntity(folder);
        return (Folder) NodeMapper.toDomain(folderRepository.save(entity));
    }

    @Override
    @Transactional
    public void deleteById(Long id, String ownerId) {
        nodeRepository
            .findByIdAndOwnerId(id, ownerId)
            .ifPresent(entity -> {
                if (entity instanceof FolderEntity) {
                    permanentlyDeleteChildren(entity.getId());
                }
                nodeRepository.delete(entity);
            });
    }

    private void permanentlyDeleteChildren(Long parentId) {
        List<NodeEntity> children = nodeRepository.findByParentId(parentId);
        for (NodeEntity child : children) {
            if (child instanceof FolderEntity) {
                permanentlyDeleteChildren(child.getId());
            }
            nodeRepository.delete(child);
        }
    }

    @Override
    @Transactional
    public void softDelete(Long id, String ownerId) {
        nodeRepository
            .findByIdAndOwnerId(id, ownerId)
            .ifPresent(entity -> {
                entity.setDeleted(true);
                entity.setDeletedAt(LocalDateTime.now(ZoneOffset.UTC));
                nodeRepository.save(entity);
                softDeleteChildren(entity.getId());
            });
    }

    private void softDeleteChildren(Long parentId) {
        List<NodeEntity> children = nodeRepository.findByParentId(parentId);
        for (NodeEntity child : children) {
            if (!child.isDeleted()) {
                child.setDeleted(true);
                child.setDeletedAt(LocalDateTime.now(ZoneOffset.UTC));
                nodeRepository.save(child);
                if (child instanceof FolderEntity) {
                    softDeleteChildren(child.getId());
                }
            }
        }
    }

    @Override
    @Transactional
    public void restore(Long id, String ownerId) {
        nodeRepository
            .findByIdAndOwnerId(id, ownerId)
            .ifPresent(entity -> {
                entity.setDeleted(false);
                entity.setDeletedAt(null);
                nodeRepository.save(entity);
                restoreChildren(entity.getId());
            });
    }

    private void restoreChildren(Long parentId) {
        List<NodeEntity> children = nodeRepository.findByParentId(parentId);
        for (NodeEntity child : children) {
            if (child.isDeleted()) {
                child.setDeleted(false);
                child.setDeletedAt(null);
                nodeRepository.save(child);
                if (child instanceof FolderEntity) {
                    restoreChildren(child.getId());
                }
            }
        }
    }

    @Override
    public List<Storable> findTrash(String ownerId) {
        return nodeRepository
            .findByOwnerIdAndIsDeletedTrue(ownerId)
            .stream()
            .map(NodeMapper::toDomain)
            .toList();
    }

    @Override
    public List<Storable> findAllTrash() {
        return nodeRepository
            .findAllDeleted()
            .stream()
            .map(NodeMapper::toDomain)
            .toList();
    }

    @Override
    @Transactional
    public void emptyTrash(String ownerId) {
        List<NodeEntity> trash = nodeRepository.findByOwnerIdAndIsDeletedTrue(
            ownerId
        );
        for (NodeEntity entity : trash) {
            if (entity instanceof FolderEntity) {
                permanentlyDeleteChildren(entity.getId());
            }
            nodeRepository.delete(entity);
        }
    }

    @Override
    public Optional<Folder> findFolder(
        String name,
        Long parentId,
        String ownerId
    ) {
        return folderRepository
            .findByNameAndParentIdAndOwnerIdAndIsDeletedFalse(
                name,
                parentId,
                ownerId
            )
            .map(entity -> (Folder) NodeMapper.toDomain(entity));
    }

    @Override
    public boolean existsByNameAndParent(String name, Long parentId) {
        return folderRepository.existsByNameAndParentIdAndIsDeletedFalse(
            name,
            parentId
        );
    }

    @Override
    public List<Storable> search(String query, String kind, String ownerId) {
        return nodeRepository
            .search(query, ownerId)
            .stream()
            .map(NodeMapper::toDomain)
            .toList();
    }

    @Override
    public List<Storable> searchGlobal(String query, String kind) {
        return nodeRepository
            .searchGlobal(query)
            .stream()
            .map(NodeMapper::toDomain)
            .toList();
    }

    @Override
    @Transactional
    public Storable toggleFavorite(
        Long id,
        boolean isFavorite,
        String ownerId
    ) {
        return nodeRepository
            .findByIdAndOwnerId(id, ownerId)
            .map(entity -> {
                entity.setFavorite(isFavorite);
                return NodeMapper.toDomain(nodeRepository.save(entity));
            })
            .orElseThrow(() ->
                new RuntimeException("Node not found or access denied: " + id)
            );
    }

    @Override
    public List<Storable> findFavorites(String ownerId) {
        return nodeRepository
            .findByOwnerIdAndIsFavoriteTrueAndIsDeletedFalse(ownerId)
            .stream()
            .map(NodeMapper::toDomain)
            .toList();
    }
}
