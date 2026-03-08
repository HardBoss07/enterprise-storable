package dev.m4tt3o.storable.api.controller;

import dev.m4tt3o.storable.api.request.CreateFolderRequest;
import dev.m4tt3o.storable.api.request.RecursiveFolderRequest;
import dev.m4tt3o.storable.core.config.StorableAuthConfig;
import dev.m4tt3o.storable.core.dto.FileMetadataDto;
import dev.m4tt3o.storable.core.service.FileService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
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

/**
 * Controller for file and folder management.
 */
@Slf4j
@RestController
@RequestMapping("/api/files")
@RequiredArgsConstructor
public class FileController {

    private final FileService fileService;
    private final StorableAuthConfig authConfig;

    @GetMapping("/health")
    /** Simple health check endpoint. */
    public Map<String, String> health() {
        return Map.of("status", "UP");
    }

    @GetMapping("/{nodeId}")
    /** Retrieves metadata for a specific node. */
    public FileMetadataDto getMetadata(@PathVariable Long nodeId) {
        log.info("Request to get metadata for node: {}", nodeId);
        if (nodeId == null || nodeId == 0) return null;
        return fileService.getMetadata(nodeId);
    }

    @GetMapping("/{nodeId}/children")
    /** Retrieves children for a given parent node ID. */
    public List<FileMetadataDto> getChildren(@PathVariable Long nodeId) {
        log.info("Request to get children for node: {}", nodeId);
        Long id = (nodeId == null || nodeId == 0) ? null : nodeId;
        return fileService.getChildren(id);
    }

    @PostMapping("/folders")
    /** Creates a new folder. */
    public FileMetadataDto createFolder(@RequestBody CreateFolderRequest request) {
        log.info("Request to create folder: {}", request.name());
        return fileService.createFolder(request.name(), request.parentId(), authConfig.getGuestUserId());
    }

    @PostMapping("/folders/recursive")
    /** Creates folders recursively based on a path. */
    public FileMetadataDto createFolderRecursive(@RequestBody RecursiveFolderRequest request) {
        log.info("Request to recursively create folders for path: {}", request.path());
        return fileService.createFolderRecursive(request.path(), authConfig.getGuestUserId());
    }

    @PostMapping("/upload")
    /** Uploads a file. */
    public FileMetadataDto uploadFile(
            @RequestParam("file") MultipartFile file,
            @RequestParam(value = "parentId", required = false) Long parentId) throws IOException {
        
        log.info("Request to upload file: {}", file.getOriginalFilename());
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
    /** Downloads a file. */
    public ResponseEntity<Resource> downloadFile(@PathVariable Long nodeId) {
        log.info("Request to download node: {}", nodeId);
        FileMetadataDto metadata = fileService.getMetadata(nodeId);
        if (metadata == null) {
            return ResponseEntity.notFound().build();
        }

        InputStream inputStream = fileService.downloadFile(nodeId);
        Resource resource = new InputStreamResource(inputStream);

        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(metadata.mime() != null ? metadata.mime() : "application/octet-stream"))
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + metadata.name() + "\"")
                .contentLength(metadata.size() != null ? metadata.size() : 0)
                .body(resource);
    }
}
