package dev.m4tt3o.storable.api.controller;

import dev.m4tt3o.storable.api.request.CreateFolderRequest;
import dev.m4tt3o.storable.api.request.RecursiveFolderRequest;
import dev.m4tt3o.storable.common.dto.FileMetadataDto;
import dev.m4tt3o.storable.common.dto.TrashMetadataDto;
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
    public FileMetadataDto getMetadata(@PathVariable Long nodeId, @AuthenticationPrincipal String userId) {
        log.info("Request to get metadata for node: {} by user ID: {}", nodeId, userId);
        if (nodeId == null || nodeId == 0) return null;
        return fileService.getMetadata(nodeId, userId);
    }

    @GetMapping("/{nodeId}/children")
    /** Retrieves children for a given parent node ID. */
    public List<FileMetadataDto> getChildren(@PathVariable Long nodeId, @AuthenticationPrincipal String userId) {
        log.info("Request to get children for node: {} by user ID: {}", nodeId, userId);
        Long id = (nodeId == null || nodeId == 0) ? null : nodeId;
        return fileService.getChildren(id, userId);
    }

    @GetMapping("/home")
    /** Retrieves the home folder for the current user. */
    public FileMetadataDto getHome(@AuthenticationPrincipal String userId) {
        log.info("Request to get home folder for user ID: {}", userId);
        // We need the username for getHomeNode, but we only have userId in principal now.
        // Option 1: Store username in JWT and extract it.
        // Option 2: Change getHomeNode to accept userId only if possible.
        // Looking at FileServiceImpl, it uses username to find folder named after user.
        // For now, let's assume we can get it from a service if needed, 
        // but wait, AuthService already creates home folder with username.
        // I will check if FileService.getHomeNode can be simplified.
        
        // Actually, let's check FileService interface.
        return fileService.getHomeNode(userId, null); // I'll update FileServiceImpl to handle null username
    }

    @GetMapping("/{nodeId}/path")
    /** Retrieves the virtualized path for a given node. */
    public List<FileMetadataDto> getPath(@PathVariable Long nodeId, @AuthenticationPrincipal String userId) {
        log.info("Request to get path for node: {} by user ID: {}", nodeId, userId);
        return fileService.getPath(nodeId, userId, null); // Update implementation to handle null
    }

    @PostMapping("/folders")
    /** Creates a new folder. */
    public FileMetadataDto createFolder(@RequestBody CreateFolderRequest request, @AuthenticationPrincipal String userId) {
        log.info("Request to create folder: {} by user ID: {}", request.name(), userId);
        return fileService.createFolder(request.name(), request.parentId(), userId);
    }

    @PostMapping("/folders/recursive")
    /** Creates folders recursively based on a path. */
    public FileMetadataDto createFolderRecursive(@RequestBody RecursiveFolderRequest request, @AuthenticationPrincipal String userId) {
        log.info("Request to recursively create folders for path: {} by user ID: {}", request.path(), userId);
        return fileService.createFolderRecursive(request.path(), userId);
    }

    @PostMapping("/upload")
    /** Uploads a file. */
    public FileMetadataDto uploadFile(
            @RequestParam("file") MultipartFile file,
            @RequestParam(value = "parentId", required = false) Long parentId,
            @AuthenticationPrincipal String userId) throws IOException {
        
        log.info("Request to upload file: {} by user ID: {}", file.getOriginalFilename(), userId);
        return fileService.uploadFile(
                file.getInputStream(),
                file.getOriginalFilename(),
                file.getContentType(),
                file.getSize(),
                parentId,
                userId
        );
    }

    @GetMapping("/{nodeId}/download")
    /** Downloads a file. */
    public ResponseEntity<Resource> downloadFile(@PathVariable Long nodeId, @AuthenticationPrincipal String userId) {
        log.info("Request to download node: {} by user ID: {}", nodeId, userId);
        FileMetadataDto metadata = fileService.getMetadata(nodeId, userId);
        if (metadata == null) {
            return ResponseEntity.notFound().build();
        }

        InputStream inputStream = fileService.downloadFile(nodeId, userId);
        Resource resource = new InputStreamResource(inputStream);

        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(metadata.mime() != null ? metadata.mime() : "application/octet-stream"))
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + metadata.name() + "\"")
                .contentLength(metadata.size() != null ? metadata.size() : 0)
                .body(resource);
    }

    @DeleteMapping("/{nodeId}")
    /** Soft deletes a node. */
    public ResponseEntity<Void> softDelete(@PathVariable Long nodeId, @AuthenticationPrincipal String userId) {
        log.info("Request to soft delete node: {} by user ID: {}", nodeId, userId);
        fileService.softDelete(nodeId, userId);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{nodeId}/restore")
    /** Restores a soft-deleted node. */
    public ResponseEntity<Void> restore(@PathVariable Long nodeId, @AuthenticationPrincipal String userId) {
        log.info("Request to restore node: {} by user ID: {}", nodeId, userId);
        fileService.restore(nodeId, userId);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/trash")
    /** Retrieves all soft-deleted nodes for the current user. */
    public List<TrashMetadataDto> getTrash(@AuthenticationPrincipal String userId) {
        log.info("Request to get trash for user ID: {}", userId);
        return fileService.getTrash(userId);
    }

    @GetMapping("/admin/trash")
    @PreAuthorize("hasRole('ADMIN')")
    /** Retrieves all soft-deleted nodes for all users (Admin only). */
    public List<TrashMetadataDto> getAllTrash(@AuthenticationPrincipal String userId) {
        log.info("Admin request to get all trash by user ID: {}", userId);
        return fileService.getAllTrash();
    }

    @DeleteMapping("/{nodeId}/permanent")
    /** Permanently deletes a node. */
    public ResponseEntity<Void> permanentlyDelete(@PathVariable Long nodeId, @AuthenticationPrincipal String userId) {
        log.info("Request to permanently delete node: {} by user ID: {}", nodeId, userId);
        fileService.permanentlyDelete(nodeId, userId);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/trash/empty")
    /** Permanently deletes all nodes in trash for the current user. */
    public ResponseEntity<Void> emptyTrash(@AuthenticationPrincipal String userId) {
        log.info("Request to empty trash by user ID: {}", userId);
        fileService.emptyTrash(userId);
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
    public FileMetadataDto rename(@PathVariable Long nodeId, @RequestBody Map<String, String> body, @AuthenticationPrincipal String userId) {
        String newName = body.get("name");
        log.info("Request to rename node: {} to: {} by user ID: {}", nodeId, newName, userId);
        return fileService.rename(nodeId, newName, userId);
    }

    @PostMapping("/{nodeId}/duplicate")
    /** Duplicates a file with an optional new name. */
    public FileMetadataDto duplicate(@PathVariable Long nodeId, @RequestBody(required = false) Map<String, String> body, @AuthenticationPrincipal String userId) {
        String newName = body != null ? body.get("name") : null;
        log.info("Request to duplicate node: {} with name: {} by user ID: {}", nodeId, newName, userId);
        return fileService.duplicate(nodeId, newName, userId);
    }

    @PatchMapping("/{nodeId}/move")
    /** Moves a node. */
    public FileMetadataDto move(@PathVariable Long nodeId, @RequestBody Map<String, Long> body, @AuthenticationPrincipal String userId) {
        Long targetParentId = body.get("targetParentId");
        log.info("Request to move node: {} to: {} by user ID: {}", nodeId, targetParentId, userId);
        return fileService.move(nodeId, targetParentId, userId);
    }

    @GetMapping("/search")
    /** Searches for nodes. */
    public List<FileMetadataDto> search(
            @RequestParam("query") String query,
            @RequestParam(value = "kind", required = false) String kind,
            @AuthenticationPrincipal String userId) {
        log.info("Request to search nodes with query: {} and kind: {} by user ID: {}", query, kind, userId);
        return fileService.search(query, kind, userId);
    }

    @GetMapping("/recent")
    /** Retrieves the 5 most recently modified files for the current user. */
    public List<FileMetadataDto> getRecent(@AuthenticationPrincipal String userId) {
        log.info("Request to get recent files for user ID: {}", userId);
        return fileService.getRecentFiles(userId);
    }

    @GetMapping("/favorites")
    /** Retrieves all favorite nodes for the current user. */
    public List<FileMetadataDto> getFavorites(@AuthenticationPrincipal String userId) {
        log.info("Request to get favorites for user ID: {}", userId);
        return fileService.getFavorites(userId);
    }

    @PatchMapping("/{nodeId}/favorite")
    /** Toggles the favorite status of a node. */
    public FileMetadataDto toggleFavorite(@PathVariable Long nodeId, @RequestBody Map<String, Boolean> body, @AuthenticationPrincipal String userId) {
        Boolean isFavorite = body.get("isFavorite");
        if (isFavorite == null) {
            throw new IllegalArgumentException("isFavorite field is required");
        }
        log.info("Request to toggle favorite for node: {} to: {} by user ID: {}", nodeId, isFavorite, userId);
        return fileService.toggleFavorite(nodeId, isFavorite, userId);
    }
}
