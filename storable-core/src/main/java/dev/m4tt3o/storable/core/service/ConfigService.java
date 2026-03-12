package dev.m4tt3o.storable.core.service;

import dev.m4tt3o.storable.common.entity.SystemSetting;
import dev.m4tt3o.storable.common.repository.SystemSettingRepository;
import dev.m4tt3o.storable.core.config.StorageProperties;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service for managing global system configurations.
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class ConfigService {

    private final SystemSettingRepository repository;
    private final StorageProperties storageProperties;

    private static final String TRASH_RETENTION_KEY = "trash_retention_days";
    private static final String SYSTEM_TIMEZONE_KEY = "system_timezone";

    /** Retrieves the trash retention days from DB or default. */
    @Transactional(readOnly = true)
    public int getTrashRetentionDays() {
        log.debug("Fetching trash retention days for key: {}", TRASH_RETENTION_KEY);
        try {
            return repository.findById(TRASH_RETENTION_KEY)
                    .map(s -> {
                        try {
                            return Integer.parseInt(s.getSettingValue());
                        } catch (NumberFormatException e) {
                            log.error("Invalid trash retention value in DB: {}", s.getSettingValue());
                            return storageProperties.getTrashRetentionDays();
                        }
                    })
                    .orElseGet(() -> {
                        log.warn("Trash retention key not found in DB, using default: {}", storageProperties.getTrashRetentionDays());
                        return storageProperties.getTrashRetentionDays();
                    });
        } catch (Exception e) {
            log.error("Database error while fetching system setting {}: {}", TRASH_RETENTION_KEY, e.getMessage(), e);
            return storageProperties.getTrashRetentionDays(); // Fallback to default on DB error
        }
    }

    /** Updates the trash retention days. */
    @Transactional
    public void setTrashRetentionDays(int days) {
        log.info("Updating global trash retention days to: {}", days);
        SystemSetting setting = repository.findById(TRASH_RETENTION_KEY)
                .orElse(new SystemSetting(TRASH_RETENTION_KEY, String.valueOf(days)));
        setting.setSettingValue(String.valueOf(days));
        repository.save(setting);
    }

    /** Retrieves the system timezone from DB or default. */
    @Transactional(readOnly = true)
    public String getSystemTimezone() {
        return repository.findById(SYSTEM_TIMEZONE_KEY)
                .map(SystemSetting::getSettingValue)
                .orElse("UTC");
    }

    /** Updates the system timezone. */
    @Transactional
    public void setSystemTimezone(String timezone) {
        log.info("Updating global system timezone to: {}", timezone);
        SystemSetting setting = repository.findById(SYSTEM_TIMEZONE_KEY)
                .orElse(new SystemSetting(SYSTEM_TIMEZONE_KEY, timezone));
        setting.setSettingValue(timezone);
        repository.save(setting);
    }
}
