package dev.m4tt3o.storable.api.controller;

import dev.m4tt3o.storable.core.service.ConfigService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

/**
 * Controller for administrative system-wide configurations.
 */
@Slf4j
@RestController
@RequestMapping("/api/admin/config")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    private final ConfigService configService;

    @GetMapping("/trash-retention")
    /** Retrieves current trash retention days. */
    public ResponseEntity<Map<String, Integer>> getTrashRetention() {
        log.info("Admin request to get trash retention days");
        try {
            int days = configService.getTrashRetentionDays();
            return ResponseEntity.ok(Map.of("days", days));
        } catch (Exception e) {
            log.error("Failed to get trash retention: {}", e.getMessage(), e);
            throw e; // Rethrow to be caught by GlobalExceptionHandler
        }
    }

    @PostMapping("/trash-retention")
    /** Updates trash retention days. */
    public ResponseEntity<Void> updateTrashRetention(@RequestBody Map<String, Integer> request) {
        Integer days = request.get("days");
        if (days == null || days < 0) {
            return ResponseEntity.badRequest().build();
        }
        configService.setTrashRetentionDays(days);
        return ResponseEntity.ok().build();
    }
}
