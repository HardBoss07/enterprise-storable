package dev.m4tt3o.storable.core.service;

import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.ZoneId;

/**
 * Provides a cached ZoneId for the global system timezone.
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class GlobalTimeProvider {

    private final ConfigService configService;
    private ZoneId cachedZoneId;

    @PostConstruct
    public void init() {
        refreshCache();
    }

    /**
     * Refreshes the cached ZoneId from the database every 15 minutes.
     */
    @Scheduled(fixedRate = 900000) // 15 minutes in milliseconds
    public void refreshCache() {
        String timezone = configService.getSystemTimezone();
        try {
            this.cachedZoneId = ZoneId.of(timezone);
            log.info("Global timezone cache refreshed: {}", timezone);
        } catch (Exception e) {
            log.error("Invalid timezone found in settings: {}. Defaulting to UTC.", timezone);
            this.cachedZoneId = ZoneId.of("UTC");
        }
    }

    /**
     * Returns the currently cached ZoneId.
     */
    public ZoneId getZoneId() {
        return cachedZoneId != null ? cachedZoneId : ZoneId.of("UTC");
    }
}
