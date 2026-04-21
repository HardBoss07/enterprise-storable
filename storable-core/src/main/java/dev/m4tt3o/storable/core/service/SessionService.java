package dev.m4tt3o.storable.core.service;

import dev.m4tt3o.storable.core.port.SystemSettingPort;
import java.time.Instant;
import java.util.Optional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

/**
 * Service for managing user sessions and global session revocation.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class SessionService {

    private final SystemSettingPort systemSettingPort;

    private static final String SESSIONS_REVOKED_AT_KEY = "sessions_revoked_at";
    private static final String ROOT_USER_ID =
        "f43c0bcf-11e4-4629-b072-321ccd04e72a";

    // In-memory cache for faster access
    private Instant sessionsRevokedAt = null;

    /**
     * Revokes all active sessions for all users except the root user.
     */
    public void revokeAllSessions() {
        log.warn("Revoking all user sessions globally (Nuclear Reset).");
        Instant now = Instant.now();
        systemSettingPort.saveSetting(
            SESSIONS_REVOKED_AT_KEY,
            String.valueOf(now.toEpochMilli())
        );
        this.sessionsRevokedAt = now;
    }

    /**
     * Checks if a session is still valid based on its issue date and the global revocation timestamp.
     *
     * @param userId The ID of the user.
     * @param issuedAt The instant when the session (JWT) was issued.
     * @return true if the session is valid, false otherwise.
     */
    public boolean isSessionValid(String userId, Instant issuedAt) {
        // Root user sessions are never revoked by the global reset
        if (ROOT_USER_ID.equals(userId)) {
            return true;
        }

        Instant revokedAt = getSessionsRevokedAt();
        if (revokedAt == null) {
            return true;
        }

        // Session is valid only if issued AFTER the last global revocation
        return issuedAt.isAfter(revokedAt);
    }

    private Instant getSessionsRevokedAt() {
        if (sessionsRevokedAt != null) {
            return sessionsRevokedAt;
        }

        Optional<String> setting = systemSettingPort.getSetting(
            SESSIONS_REVOKED_AT_KEY
        );
        if (setting.isPresent()) {
            try {
                long millis = Long.parseLong(setting.get());
                sessionsRevokedAt = Instant.ofEpochMilli(millis);
                return sessionsRevokedAt;
            } catch (NumberFormatException e) {
                log.error(
                    "Failed to parse sessions_revoked_at setting: {}",
                    setting.get()
                );
            }
        }

        return null;
    }
}
