package dev.m4tt3o.storable.api.controller;

import dev.m4tt3o.storable.api.mapper.FileApiMapper;
import dev.m4tt3o.storable.api.request.CreateFolderRequest;
import dev.m4tt3o.storable.api.request.RecursiveFolderRequest;
import dev.m4tt3o.storable.common.dto.FileMetadataDto;
import dev.m4tt3o.storable.common.dto.TrashMetadataDto;
import dev.m4tt3o.storable.core.domain.Storable;
import dev.m4tt3o.storable.core.service.FileService;
import java.io.IOException;
import java.io.InputStream;
import java.util.List;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.io.InputStreamResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

/**
 * Controller for file and folder management.
 */
@Slf4j
@RestController
@RequestMapping("/api/files")
@RequiredArgsConstructor
public class FileController {

    private final FileService fileService;
    private final FileApiMapper fileApiMapper;

    @GetMapping("/health")
    public Map<String, String> health() {
        return Map.of("status", "UP");
    }

    @GetMapping("/{nodeId}")
    public FileMetadataDto getMetadata(
        @PathVariable Long nodeId,
        @AuthenticationPrincipal String userId
    ) {
        log.info(
            "Request to get metadata for node: {} by user ID: {}",
            nodeId,
            userId
        );
        return fileApiMapper.toDto(
            fileService.getMetadata(nodeId, userId),
            userId
        );
    }

    @GetMapping("/{nodeId}/children")
    public List<FileMetadataDto> getChildren(
        @PathVariable Long nodeId,
        @AuthenticationPrincipal String userId
    ) {
        log.info(
            "Request to get children for node: {} by user ID: {}",
            nodeId,
            userId
        );
        return fileApiMapper.toDtoList(
            fileService.getChildren(nodeId, userId),
            userId
        );
    }

    @GetMapping("/home")
    public FileMetadataDto getHome(@AuthenticationPrincipal String userId) {
        log.info("Request to get home folder for user ID: {}", userId);
        return fileApiMapper.toDto(
            fileService.getHomeNode(userId, null),
            userId
        );
    }

    @GetMapping("/{nodeId}/path")
    public List<FileMetadataDto> getPath(
        @PathVariable Long nodeId,
        @AuthenticationPrincipal String userId
    ) {
        log.info(
            "Request to get path for node: {} by user ID: {}",
            nodeId,
            userId
        );
        return fileApiMapper.toDtoList(
            fileService.getPath(nodeId, userId, null),
            userId
        );
    }

    @PostMapping("/folders")
    public FileMetadataDto createFolder(
        @RequestBody CreateFolderRequest request,
        @AuthenticationPrincipal String userId
    ) {
        log.info(
            "Request to create folder: {} by user ID: {}",
            request.name(),
            userId
        );
        return fileApiMapper.toDto(
            fileService.createFolder(
                request.name(),
                request.parentId(),
                userId
            ),
            userId
        );
    }

    @PostMapping("/folders/recursive")
    public FileMetadataDto createFolderRecursive(
        @RequestBody RecursiveFolderRequest request,
        @AuthenticationPrincipal String userId
    ) {
        log.info(
            "Request to recursively create folders for path: {} by user ID: {}",
            request.path(),
            userId
        );
        return fileApiMapper.toDto(
            fileService.createFolderRecursive(request.path(), userId),
            userId
        );
    }

    @PostMapping("/upload")
    public FileMetadataDto uploadFile(
        @RequestParam("file") MultipartFile file,
        @RequestParam(value = "parentId", required = false) Long parentId,
        @AuthenticationPrincipal String userId
    ) throws IOException {
        log.info(
            "Request to upload file: {} by user ID: {}",
            file.getOriginalFilename(),
            userId
        );
        return fileApiMapper.toDto(
            fileService.uploadFile(
                file.getInputStream(),
                file.getOriginalFilename(),
                file.getContentType(),
                file.getSize(),
                parentId,
                userId
            ),
            userId
        );
    }

    @GetMapping("/{nodeId}/download")
    public ResponseEntity<Resource> downloadFile(
        @PathVariable Long nodeId,
        @AuthenticationPrincipal String userId
    ) {
        log.info("Request to download node: {} by user ID: {}", nodeId, userId);
        Storable metadata = fileService.getMetadata(nodeId, userId);
        if (metadata == null) return ResponseEntity.notFound().build();

        InputStream inputStream = fileService.downloadFile(nodeId, userId);
        Resource resource = new InputStreamResource(inputStream);

        return ResponseEntity.ok()
            .contentType(
                MediaType.parseMediaType(
                    metadata instanceof
                            dev.m4tt3o.storable.core.domain.File f &&
                        f.mime() != null
                        ? f.mime()
                        : "application/octet-stream"
                )
            )
            .header(
                HttpHeaders.CONTENT_DISPOSITION,
                "attachment; filename=\"" + metadata.name() + "\""
            )
            .contentLength(
                metadata instanceof dev.m4tt3o.storable.core.domain.File f &&
                    f.size() != null
                    ? f.size()
                    : 0
            )
            .body(resource);
    }

    @DeleteMapping("/{nodeId}")
    public ResponseEntity<Void> softDelete(
        @PathVariable Long nodeId,
        @AuthenticationPrincipal String userId
    ) {
        log.info(
            "Request to soft delete node: {} by user ID: {}",
            nodeId,
            userId
        );
        fileService.softDelete(nodeId, userId);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{nodeId}/restore")
    public ResponseEntity<Void> restore(
        @PathVariable Long nodeId,
        @AuthenticationPrincipal String userId
    ) {
        log.info("Request to restore node: {} by user ID: {}", nodeId, userId);
        fileService.restore(nodeId, userId);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/trash")
    public List<TrashMetadataDto> getTrash(
        @AuthenticationPrincipal String userId
    ) {
        log.info("Request to get trash for user ID: {}", userId);
        return fileApiMapper.toTrashDtoList(
            fileService.getTrash(userId),
            userId
        );
    }

    @GetMapping("/admin/trash")
    @PreAuthorize("hasRole('ADMIN')")
    public List<TrashMetadataDto> getAllTrash(
        @AuthenticationPrincipal String userId
    ) {
        log.info("Admin request to get all trash by user ID: {}", userId);
        return fileApiMapper.toTrashDtoList(fileService.getAllTrash(), userId);
    }

    @DeleteMapping("/{nodeId}/permanent")
    public ResponseEntity<Void> permanentlyDelete(
        @PathVariable Long nodeId,
        @AuthenticationPrincipal String userId
    ) {
        log.info(
            "Request to permanently delete node: {} by user ID: {}",
            nodeId,
            userId
        );
        fileService.permanentlyDelete(nodeId, userId);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/trash/empty")
    public ResponseEntity<Void> emptyTrash(
        @AuthenticationPrincipal String userId
    ) {
        log.info("Request to empty trash by user ID: {}", userId);
        fileService.emptyTrash(userId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/trash/retention")
    public ResponseEntity<Map<String, Integer>> getTrashRetention() {
        return ResponseEntity.ok(
            Map.of("days", fileService.getTrashRetentionDays())
        );
    }

    @PatchMapping("/{nodeId}/rename")
    public FileMetadataDto rename(
        @PathVariable Long nodeId,
        @RequestBody Map<String, String> body,
        @AuthenticationPrincipal String userId
    ) {
        String newName = body.get("name");
        log.info(
            "Request to rename node: {} to: {} by user ID: {}",
            nodeId,
            newName,
            userId
        );
        return fileApiMapper.toDto(
            fileService.rename(nodeId, newName, userId),
            userId
        );
    }

    @PostMapping("/{nodeId}/duplicate")
    public FileMetadataDto duplicate(
        @PathVariable Long nodeId,
        @RequestBody(required = false) Map<String, String> body,
        @AuthenticationPrincipal String userId
    ) {
        String newName = body != null ? body.get("name") : null;
        log.info(
            "Request to duplicate node: {} with name: {} by user ID: {}",
            nodeId,
            newName,
            userId
        );
        return fileApiMapper.toDto(
            fileService.duplicate(nodeId, newName, userId),
            userId
        );
    }

    @PatchMapping("/{nodeId}/move")
    public FileMetadataDto move(
        @PathVariable Long nodeId,
        @RequestBody Map<String, Long> body,
        @AuthenticationPrincipal String userId
    ) {
        Long targetParentId = body.get("targetParentId");
        log.info(
            "Request to move node: {} to: {} by user ID: {}",
            nodeId,
            targetParentId,
            userId
        );
        return fileApiMapper.toDto(
            fileService.move(nodeId, targetParentId, userId),
            userId
        );
    }

    @GetMapping("/search")
    public List<FileMetadataDto> search(
        @RequestParam("query") String query,
        @RequestParam(value = "kind", required = false) String kind,
        @AuthenticationPrincipal String userId
    ) {
        log.info(
            "Request to search nodes with query: {} and kind: {} by user ID: {}",
            query,
            kind,
            userId
        );
        return fileApiMapper.toDtoList(
            fileService.search(query, kind, userId),
            userId
        );
    }

    @GetMapping("/recent")
    public List<FileMetadataDto> getRecent(
        @AuthenticationPrincipal String userId
    ) {
        log.info("Request to get recent files for user ID: {}", userId);
        return fileApiMapper.toDtoList(
            fileService
                .getRecentFiles(userId)
                .stream()
                .map(f -> (Storable) f)
                .toList(),
            userId
        );
    }

    @GetMapping("/favorites")
    public List<FileMetadataDto> getFavorites(
        @AuthenticationPrincipal String userId
    ) {
        log.info("Request to get favorites for user ID: {}", userId);
        return fileApiMapper.toDtoList(
            fileService.getFavorites(userId),
            userId
        );
    }

    @PatchMapping("/{nodeId}/favorite")
    public FileMetadataDto toggleFavorite(
        @PathVariable Long nodeId,
        @RequestBody Map<String, Boolean> body,
        @AuthenticationPrincipal String userId
    ) {
        Boolean isFavorite = body.get("isFavorite");
        if (isFavorite == null) throw new IllegalArgumentException(
            "isFavorite field is required"
        );
        log.info(
            "Request to toggle favorite for node: {} to: {} by user ID: {}",
            nodeId,
            isFavorite,
            userId
        );
        return fileApiMapper.toDto(
            fileService.toggleFavorite(nodeId, isFavorite, userId),
            userId
        );
    }
}
