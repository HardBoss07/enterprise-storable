package dev.m4tt3o.storable.api.controller;

import dev.m4tt3o.storable.core.dto.FileMetadataDto;
import dev.m4tt3o.storable.core.service.FileService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Collections;
import java.util.List;

@RestController
@RequestMapping("/api/files")
@RequiredArgsConstructor
public class FileController {

    // This would be injected, but we don't have the service implementation yet.
    // private final FileService fileService;

    @GetMapping("/{nodeId}")
    public FileMetadataDto getMetadata(@PathVariable String nodeId) {
        // Dummy implementation
        return new FileMetadataDto();
    }

    @GetMapping("/{nodeId}/children")
    public List<FileMetadataDto> getChildren(@PathVariable String nodeId) {
        // Dummy implementation
        return Collections.emptyList();
    }
}
