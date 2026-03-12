package dev.m4tt3o.storable.common.dto;

import java.time.ZoneId;

/**
 * DTO for global system settings.
 */
public record GlobalSettingsDto(
    int trashRetentionDays,
    String systemTimezone
) {
    /**
     * Validates if the provided timezone is a valid IANA timezone.
     */
    public boolean isValidTimezone() {
        try {
            ZoneId.of(systemTimezone);
            return true;
        } catch (Exception e) {
            return false;
        }
    }
}
