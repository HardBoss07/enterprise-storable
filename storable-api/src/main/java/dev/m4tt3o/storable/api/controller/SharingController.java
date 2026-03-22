package dev.m4tt3o.storable.api.controller;

import dev.m4tt3o.storable.api.mapper.FileApiMapper;
import dev.m4tt3o.storable.api.request.ShareRequest;
import dev.m4tt3o.storable.common.dto.AccessPrivilegeDto;
import dev.m4tt3o.storable.common.dto.FileMetadataDto;
import dev.m4tt3o.storable.common.dto.UserLookupDto;
import dev.m4tt3o.storable.core.domain.AccessPrivilege;
import dev.m4tt3o.storable.core.service.SharingService;
import java.util.List;
import java.util.SequencedCollection;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

/**
 * Controller for managing file/folder sharing.
 * Uses Constructor Injection and maps domain models to API Records.
 */
@Slf4j
@RestController
@RequestMapping("/api/sharing")
public class SharingController {

    private final SharingService sharingService;
    private final FileApiMapper fileApiMapper;

    /** Constructor Injection. */
    public SharingController(SharingService sharingService, FileApiMapper fileApiMapper) {
        this.sharingService = sharingService;
        this.fileApiMapper = fileApiMapper;
    }

    @GetMapping("/users")
    public ResponseEntity<List<UserLookupDto>> lookupUsers(@RequestParam String query) {
        log.info("API request: lookup users with query: {}", query);
        return ResponseEntity.ok(sharingService.lookupUsers(query));
    }

    @GetMapping("/shared-with-me")
    public ResponseEntity<List<FileMetadataDto>> getSharedWithMe(@AuthenticationPrincipal String userId) {
        log.info("API request: get shared nodes for user: {}", userId);
        SequencedCollection<dev.m4tt3o.storable.core.domain.Storable> shared = 
            new java.util.ArrayList<>(sharingService.getSharedWithMe(userId));
        return ResponseEntity.ok(fileApiMapper.toDtoList(shared, userId));
    }

    @GetMapping("/nodes/{nodeId}/privileges")
    public ResponseEntity<List<AccessPrivilegeDto>> getPrivileges(
        @PathVariable Long nodeId,
        @AuthenticationPrincipal String userId
    ) {
        log.info("API request: get privileges for node: {} by user: {}", nodeId, userId);
        List<AccessPrivilege> privileges = sharingService.getPrivileges(nodeId, userId);
        return ResponseEntity.ok(fileApiMapper.toAccessPrivilegeDtoList(privileges));
    }

    @PostMapping("/nodes/{nodeId}/share")
    public ResponseEntity<AccessPrivilegeDto> shareNode(
        @PathVariable Long nodeId,
        @RequestBody ShareRequest request,
        @AuthenticationPrincipal String userId
    ) {
        log.info("API request: share node: {} with user: {} at level: {}", nodeId, request.targetUserId(), request.level());
        AccessPrivilege privilege = sharingService.shareNode(nodeId, request.targetUserId(), request.level(), userId);
        return ResponseEntity.ok(fileApiMapper.toAccessPrivilegeDto(privilege));
    }

    @PutMapping("/nodes/{nodeId}/privileges/{targetUserId}")
    public ResponseEntity<AccessPrivilegeDto> updatePrivilege(
        @PathVariable Long nodeId,
        @PathVariable String targetUserId,
        @RequestBody ShareRequest request,
        @AuthenticationPrincipal String userId
    ) {
        log.info("API request: update privilege for node: {} and user: {} to level: {}", nodeId, targetUserId, request.level());
        AccessPrivilege privilege = sharingService.updatePrivilege(nodeId, targetUserId, request.level(), userId);
        return ResponseEntity.ok(fileApiMapper.toAccessPrivilegeDto(privilege));
    }

    @DeleteMapping("/nodes/{nodeId}/privileges/{targetUserId}")
    public ResponseEntity<Void> removePrivilege(
        @PathVariable Long nodeId,
        @PathVariable String targetUserId,
        @AuthenticationPrincipal String userId
    ) {
        log.info("API request: remove privilege for node: {} and user: {}", nodeId, targetUserId);
        sharingService.removePrivilege(nodeId, targetUserId, userId);
        return ResponseEntity.noContent().build();
    }
}
