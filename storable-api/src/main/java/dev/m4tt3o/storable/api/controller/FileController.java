package dev.m4tt3o.storable.api.controller;

import dev.m4tt3o.storable.core.dto.FileMetadataDto;
import dev.m4tt3o.storable.core.service.FileService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/files")
@RequiredArgsConstructor
@CrossOrigin(origins = "*") // Allow all for debugging, can tighten later
public class FileController {

    private final FileService fileService;

    @GetMapping("/health")
    public Map<String, String> health() {
        return Map.of("status", "UP");
    }

    @GetMapping("/{nodeId}")
    public FileMetadataDto getMetadata(@PathVariable Long nodeId) {
        if (nodeId == null || nodeId == 0) return null;
        return fileService.getMetadata(nodeId);
    }

    @GetMapping("/{nodeId}/children")
    public List<FileMetadataDto> getChildren(@PathVariable Long nodeId) {
        Long id = (nodeId == null || nodeId == 0) ? null : nodeId;
        return fileService.getChildren(id);
    }
}
