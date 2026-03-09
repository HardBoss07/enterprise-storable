package dev.m4tt3o.storable.api.controller;

import dev.m4tt3o.storable.api.request.CreateFolderRequest;
import dev.m4tt3o.storable.api.request.RecursiveFolderRequest;
import dev.m4tt3o.storable.common.dto.FileMetadataDto;
import dev.m4tt3o.storable.core.security.CustomUserDetails;
import dev.m4tt3o.storable.core.service.FileService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.io.InputStreamResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
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

    @GetMapping("/health")
    /** Simple health check endpoint. */
    public Map<String, String> health() {
        return Map.of("status", "UP");
    }

    @GetMapping("/{nodeId}")
    /** Retrieves metadata for a specific node. */
    public FileMetadataDto getMetadata(@PathVariable Long nodeId, @AuthenticationPrincipal CustomUserDetails user) {
        log.info("Request to get metadata for node: {} by user: {}", nodeId, user.getUsername());
        if (nodeId == null || nodeId == 0) return null;
        return fileService.getMetadata(nodeId, user.id());
    }

    @GetMapping("/{nodeId}/children")
    /** Retrieves children for a given parent node ID. */
    public List<FileMetadataDto> getChildren(@PathVariable Long nodeId, @AuthenticationPrincipal CustomUserDetails user) {
        log.info("Request to get children for node: {} by user: {}", nodeId, user.getUsername());
        Long id = (nodeId == null || nodeId == 0) ? null : nodeId;
        return fileService.getChildren(id, user.id());
    }

    @PostMapping("/folders")
    /** Creates a new folder. */
    public FileMetadataDto createFolder(@RequestBody CreateFolderRequest request, @AuthenticationPrincipal CustomUserDetails user) {
        log.info("Request to create folder: {} by user: {}", request.name(), user.getUsername());
        return fileService.createFolder(request.name(), request.parentId(), user.id());
    }

    @PostMapping("/folders/recursive")
    /** Creates folders recursively based on a path. */
    public FileMetadataDto createFolderRecursive(@RequestBody RecursiveFolderRequest request, @AuthenticationPrincipal CustomUserDetails user) {
        log.info("Request to recursively create folders for path: {} by user: {}", request.path(), user.getUsername());
        return fileService.createFolderRecursive(request.path(), user.id());
    }

    @PostMapping("/upload")
    /** Uploads a file. */
    public FileMetadataDto uploadFile(
            @RequestParam("file") MultipartFile file,
            @RequestParam(value = "parentId", required = false) Long parentId,
            @AuthenticationPrincipal CustomUserDetails user) throws IOException {
        
        log.info("Request to upload file: {} by user: {}", file.getOriginalFilename(), user.getUsername());
        return fileService.uploadFile(
                file.getInputStream(),
                file.getOriginalFilename(),
                file.getContentType(),
                file.getSize(),
                parentId,
                user.id()
        );
    }

    @GetMapping("/{nodeId}/download")
    /** Downloads a file. */
    public ResponseEntity<Resource> downloadFile(@PathVariable Long nodeId, @AuthenticationPrincipal CustomUserDetails user) {
        log.info("Request to download node: {} by user: {}", nodeId, user.getUsername());
        FileMetadataDto metadata = fileService.getMetadata(nodeId, user.id());
        if (metadata == null) {
            return ResponseEntity.notFound().build();
        }

        InputStream inputStream = fileService.downloadFile(nodeId, user.id());
        Resource resource = new InputStreamResource(inputStream);

        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(metadata.mime() != null ? metadata.mime() : "application/octet-stream"))
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + metadata.name() + "\"")
                .contentLength(metadata.size() != null ? metadata.size() : 0)
                .body(resource);
    }
}
