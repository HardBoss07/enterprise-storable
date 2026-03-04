package dev.m4tt3o.storable.core.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;
import lombok.Data;

@Data
@Configuration
@ConfigurationProperties(prefix = "storable.auth")
public class StorableAuthConfig {
    /**
     * Fixed UUID for guest/system user during development.
     */
    private String guestUserId = "00000000-0000-0000-0000-000000000000";

    /**
     * Toggle to enable/disable guest access mode.
     */
    private boolean guestModeEnabled = true;
}
