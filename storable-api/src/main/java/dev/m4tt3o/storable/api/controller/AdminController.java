package dev.m4tt3o.storable.api.controller;

import dev.m4tt3o.storable.common.dto.GlobalSettingsDto;
import dev.m4tt3o.storable.common.dto.UserDto;
import dev.m4tt3o.storable.core.service.AdminService;
import dev.m4tt3o.storable.core.service.ConfigService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Controller for administrative actions including user management and system-wide configurations.
 */
@Slf4j
@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    private final AdminService adminService;
    private final ConfigService configService;

    // --- User Management ---

    @GetMapping("/users")
    /** Lists all users with their metadata. */
    public ResponseEntity<List<UserDto>> getAllUsers() {
        log.info("Admin request: List all users");
        return ResponseEntity.ok(adminService.getAllUsers());
    }

    @DeleteMapping("/users/{id}")
    /** Removes a user and all their associated data. */
    public ResponseEntity<Void> deleteUser(@PathVariable String id) {
        log.info("Admin request: Delete user {}", id);
        adminService.deleteUser(id);
        return ResponseEntity.noContent().build();
    }

    // --- System Settings ---

    @GetMapping("/settings")
    /** Fetches global configuration settings. */
    public ResponseEntity<GlobalSettingsDto> getSettings() {
        log.info("Admin request: Fetch global settings");
        GlobalSettingsDto settings = new GlobalSettingsDto(
                configService.getTrashRetentionDays(),
                configService.getSystemTimezone()
        );
        return ResponseEntity.ok(settings);
    }

    @PatchMapping("/settings")
    /** Updates global configuration settings. */
    public ResponseEntity<Void> updateSettings(@RequestBody GlobalSettingsDto settings) {
        log.info("Admin request: Update global settings");
        
        if (settings.trashRetentionDays() < 0) {
            return ResponseEntity.badRequest().build();
        }
        
        if (!settings.isValidTimezone()) {
            log.warn("Invalid timezone provided: {}", settings.systemTimezone());
            return ResponseEntity.badRequest().build();
        }

        configService.setTrashRetentionDays(settings.trashRetentionDays());
        configService.setSystemTimezone(settings.systemTimezone());
        
        return ResponseEntity.noContent().build();
    }
}
