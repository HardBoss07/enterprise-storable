package dev.m4tt3o.storable.api.controller;

import dev.m4tt3o.storable.api.request.ShareRequest;
import dev.m4tt3o.storable.common.dto.AccessPrivilegeDto;
import dev.m4tt3o.storable.common.dto.UserLookupDto;
import dev.m4tt3o.storable.core.service.SharingService;
import java.util.List;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequestMapping("/api/sharing")
@RequiredArgsConstructor
public class SharingController {

    private final SharingService sharingService;

    @GetMapping("/users")
    public ResponseEntity<List<UserLookupDto>> lookupUsers(
        @RequestParam String query
    ) {
        return ResponseEntity.ok(sharingService.lookupUsers(query));
    }

    @GetMapping("/shared-with-me")
    public ResponseEntity<
        List<dev.m4tt3o.storable.common.dto.FileMetadataDto>
    > getSharedWithMe(@AuthenticationPrincipal String userId) {
        return ResponseEntity.ok(sharingService.getSharedWithMe(userId));
    }

    @GetMapping("/nodes/{nodeId}/privileges")
    public ResponseEntity<List<AccessPrivilegeDto>> getPrivileges(
        @PathVariable Long nodeId,
        @AuthenticationPrincipal String userId
    ) {
        return ResponseEntity.ok(sharingService.getPrivileges(nodeId, userId));
    }

    @PostMapping("/nodes/{nodeId}/share")
    public ResponseEntity<AccessPrivilegeDto> shareNode(
        @PathVariable Long nodeId,
        @RequestBody ShareRequest request,
        @AuthenticationPrincipal String userId
    ) {
        return ResponseEntity.ok(
            sharingService.shareNode(
                nodeId,
                request.targetUserId(),
                request.level(),
                userId
            )
        );
    }

    @PutMapping("/nodes/{nodeId}/privileges/{targetUserId}")
    public ResponseEntity<AccessPrivilegeDto> updatePrivilege(
        @PathVariable Long nodeId,
        @PathVariable String targetUserId,
        @RequestBody ShareRequest request,
        @AuthenticationPrincipal String userId
    ) {
        return ResponseEntity.ok(
            sharingService.updatePrivilege(
                nodeId,
                targetUserId,
                request.level(),
                userId
            )
        );
    }

    @DeleteMapping("/nodes/{nodeId}/privileges/{targetUserId}")
    public ResponseEntity<Void> removePrivilege(
        @PathVariable Long nodeId,
        @PathVariable String targetUserId,
        @AuthenticationPrincipal String userId
    ) {
        sharingService.removePrivilege(nodeId, targetUserId, userId);
        return ResponseEntity.noContent().build();
    }
}
