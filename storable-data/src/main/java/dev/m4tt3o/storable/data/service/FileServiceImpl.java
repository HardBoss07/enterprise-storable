package dev.m4tt3o.storable.data.service;

import dev.m4tt3o.storable.core.dto.FileMetadataDto;
import dev.m4tt3o.storable.core.service.FileService;
import dev.m4tt3o.storable.data.entity.FileNode;
import dev.m4tt3o.storable.data.repository.FileNodeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class FileServiceImpl implements FileService {

    private final FileNodeRepository fileNodeRepository;

    @Override
    public List<FileMetadataDto> getChildren(Long parentId) {
        return fileNodeRepository.findByParentId(parentId).stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    @Override
    public FileMetadataDto getMetadata(Long nodeId) {
        Optional<FileNode> fileNodeOptional = fileNodeRepository.findById(nodeId);
        return fileNodeOptional.map(this::convertToDto).orElse(null);
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
