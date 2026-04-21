package dev.m4tt3o.storable.api.controller;

import dev.m4tt3o.storable.core.service.SessionService;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * Controller for administrative session management.
 */
@RestController
@RequestMapping("/api/admin/sessions")
@RequiredArgsConstructor
@Slf4j
public class AdminSessionController {

    private final SessionService sessionService;

    /**
     * Nuclear Session Reset: Revokes all active user sessions globally.
     * Root user remains unaffected.
     */
    @PostMapping("/revoke-all")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, String>> revokeAllSessions() {
        log.warn("ADMIN action: Revoking all user sessions globally.");
        sessionService.revokeAllSessions();
        return ResponseEntity.ok(
            Map.of(
                "message",
                "All sessions have been revoked. Users will need to log in again."
            )
        );
    }
}
