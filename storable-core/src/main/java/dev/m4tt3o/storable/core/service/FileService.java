package dev.m4tt3o.storable.core.service;

import dev.m4tt3o.storable.core.dto.FileMetadataDto;
import java.util.List;

public interface FileService {
    List<FileMetadataDto> getChildren(String nodeId);
    FileMetadataDto getMetadata(String nodeId);
}
