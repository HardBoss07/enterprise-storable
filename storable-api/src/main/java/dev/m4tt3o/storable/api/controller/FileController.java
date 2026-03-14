package dev.m4tt3o.storable.api.controller;

import dev.m4tt3o.storable.api.request.CreateFolderRequest;
import dev.m4tt3o.storable.api.request.RecursiveFolderRequest;
import dev.m4tt3o.storable.common.dto.FileMetadataDto;
import dev.m4tt3o.storable.common.dto.TrashMetadataDto;
import dev.m4tt3o.storable.core.security.CustomUserDetails;
import dev.m4tt3o.storable.core.service.FileService;
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

    @GetMapping("/home")
    /** Retrieves the home folder for the current user. */
    public FileMetadataDto getHome(@AuthenticationPrincipal CustomUserDetails user) {
        log.info("Request to get home folder for user: {}", user.getUsername());
        return fileService.getHomeNode(user.id(), user.getUsername());
    }

    @GetMapping("/{nodeId}/path")
    /** Retrieves the virtualized path for a given node. */
    public List<FileMetadataDto> getPath(@PathVariable Long nodeId, @AuthenticationPrincipal CustomUserDetails user) {
        log.info("Request to get path for node: {} by user: {}", nodeId, user.getUsername());
        return fileService.getPath(nodeId, user.id(), user.getUsername());
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

    @DeleteMapping("/{nodeId}")
    /** Soft deletes a node. */
    public ResponseEntity<Void> softDelete(@PathVariable Long nodeId, @AuthenticationPrincipal CustomUserDetails user) {
        log.info("Request to soft delete node: {} by user: {}", nodeId, user.getUsername());
        fileService.softDelete(nodeId, user.id());
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{nodeId}/restore")
    /** Restores a soft-deleted node. */
    public ResponseEntity<Void> restore(@PathVariable Long nodeId, @AuthenticationPrincipal CustomUserDetails user) {
        log.info("Request to restore node: {} by user: {}", nodeId, user.getUsername());
        fileService.restore(nodeId, user.id());
        return ResponseEntity.ok().build();
    }

    @GetMapping("/trash")
    /** Retrieves all soft-deleted nodes for the current user. */
    public List<TrashMetadataDto> getTrash(@AuthenticationPrincipal CustomUserDetails user) {
        log.info("Request to get trash for user: {}", user.getUsername());
        return fileService.getTrash(user.id());
    }

    @GetMapping("/admin/trash")
    @PreAuthorize("hasRole('ADMIN')")
    /** Retrieves all soft-deleted nodes for all users (Admin only). */
    public List<TrashMetadataDto> getAllTrash(@AuthenticationPrincipal CustomUserDetails user) {
        log.info("Admin request to get all trash by: {}", user.getUsername());
        return fileService.getAllTrash();
    }

    @DeleteMapping("/{nodeId}/permanent")
    /** Permanently deletes a node. */
    public ResponseEntity<Void> permanentlyDelete(@PathVariable Long nodeId, @AuthenticationPrincipal CustomUserDetails user) {
        log.info("Request to permanently delete node: {} by user: {}", nodeId, user.getUsername());
        fileService.permanentlyDelete(nodeId, user.id());
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/trash/empty")
    /** Permanently deletes all nodes in trash for the current user. */
    public ResponseEntity<Void> emptyTrash(@AuthenticationPrincipal CustomUserDetails user) {
        log.info("Request to empty trash by user: {}", user.getUsername());
        fileService.emptyTrash(user.id());
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/trash/retention")
    /** Retrieves the global trash retention days. */
    public ResponseEntity<Map<String, Integer>> getTrashRetention() {
        // This uses the configService via a new method in FileService or injecting it here.
        // Actually, let's just use the AdminController's logic but without Admin restriction.
        // I will need to inject ConfigService into FileController as well.
        return ResponseEntity.ok(Map.of("days", fileService.getTrashRetentionDays()));
    }

    @PatchMapping("/{nodeId}/rename")
    /** Renames a node. */
    public FileMetadataDto rename(@PathVariable Long nodeId, @RequestBody Map<String, String> body, @AuthenticationPrincipal CustomUserDetails user) {
        String newName = body.get("name");
        log.info("Request to rename node: {} to: {} by user: {}", nodeId, newName, user.getUsername());
        return fileService.rename(nodeId, newName, user.id());
    }

    @PostMapping("/{nodeId}/duplicate")
    /** Duplicates a file with an optional new name. */
    public FileMetadataDto duplicate(@PathVariable Long nodeId, @RequestBody(required = false) Map<String, String> body, @AuthenticationPrincipal CustomUserDetails user) {
        String newName = body != null ? body.get("name") : null;
        log.info("Request to duplicate node: {} with name: {} by user: {}", nodeId, newName, user.getUsername());
        return fileService.duplicate(nodeId, newName, user.id());
    }

    @PatchMapping("/{nodeId}/move")
    /** Moves a node. */
    public FileMetadataDto move(@PathVariable Long nodeId, @RequestBody Map<String, Long> body, @AuthenticationPrincipal CustomUserDetails user) {
        Long targetParentId = body.get("targetParentId");
        log.info("Request to move node: {} to: {} by user: {}", nodeId, targetParentId, user.getUsername());
        return fileService.move(nodeId, targetParentId, user.id());
    }

    @GetMapping("/search")
    /** Searches for nodes. */
    public List<FileMetadataDto> search(
            @RequestParam("query") String query,
            @RequestParam(value = "kind", required = false) String kind,
            @AuthenticationPrincipal CustomUserDetails user) {
        log.info("Request to search nodes with query: {} and kind: {} by user: {}", query, kind, user.getUsername());
        return fileService.search(query, kind, user.id());
    }

    @GetMapping("/recent")
    /** Retrieves the 5 most recently modified files for the current user. */
    public List<FileMetadataDto> getRecent(@AuthenticationPrincipal CustomUserDetails user) {
        log.info("Request to get recent files for user: {}", user.getUsername());
        return fileService.getRecentFiles(user.id());
    }
}
