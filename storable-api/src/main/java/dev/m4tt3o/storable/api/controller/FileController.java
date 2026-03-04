package dev.m4tt3o.storable.api.controller;

import dev.m4tt3o.storable.api.request.CreateFolderRequest;
import dev.m4tt3o.storable.core.config.StorableAuthConfig;
import dev.m4tt3o.storable.core.dto.FileMetadataDto;
import dev.m4tt3o.storable.core.service.FileService;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.InputStreamResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/files")
@RequiredArgsConstructor
public class FileController {

    private final FileService fileService;
    private final StorableAuthConfig authConfig;

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

    @PostMapping("/folders")
    public FileMetadataDto createFolder(@RequestBody CreateFolderRequest request) {
        return fileService.createFolder(request.getName(), request.getParentId(), authConfig.getGuestUserId());
    }

    @PostMapping("/folders/recursive")
    public FileMetadataDto createFolderRecursive(@RequestBody Map<String, String> request) {
        return fileService.createFolderRecursive(request.get("path"), authConfig.getGuestUserId());
    }

    @PostMapping("/upload")
    public FileMetadataDto uploadFile(
            @RequestParam("file") MultipartFile file,
            @RequestParam(value = "parentId", required = false) Long parentId) throws IOException {
        
        return fileService.uploadFile(
                file.getInputStream(),
                file.getOriginalFilename(),
                file.getContentType(),
                file.getSize(),
                parentId,
                authConfig.getGuestUserId()
        );
    }

    @GetMapping("/{nodeId}/download")
    public ResponseEntity<Resource> downloadFile(@PathVariable Long nodeId) {
        FileMetadataDto metadata = fileService.getMetadata(nodeId);
        InputStream inputStream = fileService.downloadFile(nodeId);
        Resource resource = new InputStreamResource(inputStream);

        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(metadata.getMime() != null ? metadata.getMime() : "application/octet-stream"))
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + metadata.getName() + "\"")
                .body(resource);
    }
}
