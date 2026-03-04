package dev.m4tt3o.storable.data.service;

import dev.m4tt3o.storable.core.dto.FileMetadataDto;
import dev.m4tt3o.storable.core.service.FileService;
import dev.m4tt3o.storable.core.service.StorageService;
import dev.m4tt3o.storable.data.entity.FileNode;
import dev.m4tt3o.storable.data.repository.FileNodeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.InputStream;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class FileServiceImpl implements FileService {

    private final FileNodeRepository fileNodeRepository;
    private final StorageService storageService;

    @Override
    public List<FileMetadataDto> getChildren(Long parentId) {
        List<FileNode> nodes;
        if (parentId == null || parentId == 0) {
            nodes = fileNodeRepository.findByParentIdIsNull();
        } else {
            nodes = fileNodeRepository.findByParentId(parentId);
        }
        
        return nodes.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    @Override
    public long getTotalSize(String ownerId) {
        return fileNodeRepository.sumSizeByOwnerId(ownerId, FileNode.NodeKind.file);
    }

    @Override
    public FileMetadataDto getMetadata(Long nodeId) {
        if (nodeId == null || nodeId == 0) return null;
        Optional<FileNode> fileNodeOptional = fileNodeRepository.findById(nodeId);
        return fileNodeOptional.map(this::convertToDto).orElse(null);
    }

    @Override
    @Transactional
    public FileMetadataDto createFolder(String name, Long parentId, String ownerId) {
        FileNode folder = new FileNode();
        folder.setName(name);
        folder.setKind(FileNode.NodeKind.folder);
        folder.setParentId(parentId == null || parentId == 0 ? null : parentId);
        folder.setOwnerId(ownerId);
        folder.setSize(0L);
        
        FileNode saved = fileNodeRepository.save(folder);
        return convertToDto(saved);
    }

    @Override
    @Transactional
    public FileMetadataDto createFolderRecursive(String path, String ownerId) {
        if (path == null || path.trim().isEmpty()) {
            return null;
        }

        String[] parts = path.split("/");
        Long currentParentId = null;
        FileNode lastFolder = null;

        for (String part : parts) {
            if (part.isEmpty()) continue;

            Optional<FileNode> existing;
            if (currentParentId == null) {
                existing = fileNodeRepository.findByOwnerIdAndParentIdIsNullAndNameAndKind(ownerId, part, FileNode.NodeKind.folder);
            } else {
                existing = fileNodeRepository.findByOwnerIdAndParentIdAndNameAndKind(ownerId, currentParentId, part, FileNode.NodeKind.folder);
            }

            if (existing.isPresent()) {
                lastFolder = existing.get();
                currentParentId = lastFolder.getId();
            } else {
                FileNode newFolder = new FileNode();
                newFolder.setName(part);
                newFolder.setKind(FileNode.NodeKind.folder);
                newFolder.setParentId(currentParentId);
                newFolder.setOwnerId(ownerId);
                newFolder.setSize(0L);
                lastFolder = fileNodeRepository.save(newFolder);
                currentParentId = lastFolder.getId();
            }
        }

        return lastFolder != null ? convertToDto(lastFolder) : null;
    }

    @Override
    @Transactional
    public FileMetadataDto uploadFile(InputStream inputStream, String name, String mime, Long size, Long parentId, String ownerId) {
        String storageKey = UUID.randomUUID().toString();
        
        // Store physical file
        storageService.store(inputStream, storageKey);
        
        // Store metadata
        FileNode file = new FileNode();
        file.setName(name);
        file.setKind(FileNode.NodeKind.file);
        file.setParentId(parentId == null || parentId == 0 ? null : parentId);
        file.setOwnerId(ownerId);
        file.setMime(mime);
        file.setSize(size);
        file.setStorageKey(storageKey);
        
        FileNode saved = fileNodeRepository.save(file);
        return convertToDto(saved);
    }

    @Override
    public InputStream downloadFile(Long nodeId) {
        FileNode fileNode = fileNodeRepository.findById(nodeId)
                .orElseThrow(() -> new RuntimeException("File not found"));
        
        if (fileNode.getKind() != FileNode.NodeKind.file) {
            throw new RuntimeException("Cannot download a folder");
        }
        
        return storageService.load(fileNode.getStorageKey());
    }

    private FileMetadataDto convertToDto(FileNode fileNode) {
        FileMetadataDto dto = new FileMetadataDto();
        dto.setId(fileNode.getId());
        dto.setName(fileNode.getName());
        dto.setSize(fileNode.getSize());
        dto.setMime(fileNode.getMime());
        dto.setStorageKey(fileNode.getStorageKey());
        dto.setCreatedAt(fileNode.getCreatedAt());
        dto.setModifiedAt(fileNode.getModifiedAt());
        dto.setDeletedAt(fileNode.getDeletedAt());
        dto.setOwnerId(fileNode.getOwnerId());
        dto.setParentId(fileNode.getParentId());
        dto.setFolder(fileNode.getKind() == FileNode.NodeKind.folder);
        return dto;
    }
}
