package dev.m4tt3o.storable.core.service;

import dev.m4tt3o.storable.core.domain.Storable;
import dev.m4tt3o.storable.core.port.FilePersistencePort;
import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.util.List;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Background task for cleaning up expired items in the trash.
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class TrashCleanupService {

    private final FilePersistencePort filePersistencePort;
    private final ConfigService configService;

    /**
     * Runs every day at midnight to delete items older than the retention period.
     * Logic: find all nodes where is_deleted = true AND deleted_at < (now - retentionDays).
     */
    @Scheduled(cron = "0 0 0 * * *")
    @Transactional
    public void cleanupExpiredTrash() {
        log.info("Starting scheduled trash cleanup...");
        LocalDateTime cutoff = LocalDateTime.now(ZoneOffset.UTC).minusDays(
            configService.getTrashRetentionDays()
        );

        List<Storable> expiredNodes = filePersistencePort
            .findAllTrash()
            .stream()
            .filter(
                node ->
                    node.deletedAt() != null &&
                    node.deletedAt().isBefore(cutoff)
            )
            .toList();

        log.info(
            "Found {} expired nodes in trash. Permanently deleting...",
            expiredNodes.size()
        );

        for (Storable node : expiredNodes) {
            filePersistencePort.deleteById(node.id(), node.ownerId());
        }

        log.info("Trash cleanup completed.");
    }
}
