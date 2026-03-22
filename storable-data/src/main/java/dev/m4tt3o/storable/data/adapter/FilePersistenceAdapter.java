package dev.m4tt3o.storable.data.adapter;

import dev.m4tt3o.storable.core.domain.File;
import dev.m4tt3o.storable.core.port.FilePersistencePort;
import dev.m4tt3o.storable.data.entity.FileEntity;
import dev.m4tt3o.storable.data.mapper.NodeMapper;
import dev.m4tt3o.storable.data.repository.FileRepository;
import java.util.List;
import java.util.Optional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

/**
 * Adapter for File-specific persistence operations.
 */
@Component
@RequiredArgsConstructor
public class FilePersistenceAdapter implements FilePersistencePort {

    private final FileRepository fileRepository;

    @Override
    public Optional<File> findById(Long id) {
        return fileRepository
            .findById(id)
            .map(entity -> (File) NodeMapper.toDomain(entity));
    }

    @Override
    public Optional<File> findByIdAndOwner(Long id, String ownerId) {
        return fileRepository
            .findByIdAndOwnerId(id, ownerId)
            .map(entity -> (File) NodeMapper.toDomain(entity));
    }

    @Override
    @Transactional
    public File save(File file) {
        FileEntity entity = NodeMapper.toEntity(file);
        return (File) NodeMapper.toDomain(fileRepository.save(entity));
    }

    @Override
    @Transactional
    public void deleteById(Long id, String ownerId) {
        fileRepository
            .findByIdAndOwnerId(id, ownerId)
            .ifPresent(fileRepository::delete);
    }

    @Override
    public List<File> findRecent(String ownerId) {
        return fileRepository
            .findTop5ByOwnerIdAndIsDeletedFalseOrderByModifiedAtDesc(ownerId)
            .stream()
            .map(entity -> (File) NodeMapper.toDomain(entity))
            .toList();
    }

    @Override
    public long sumSizeByOwner(String ownerId) {
        return fileRepository.sumSizeByOwnerId(ownerId);
    }
}
