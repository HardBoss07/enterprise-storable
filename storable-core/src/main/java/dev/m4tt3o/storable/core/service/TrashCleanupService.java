package dev.m4tt3o.storable.core.service;

import dev.m4tt3o.storable.common.entity.FileNode;
import dev.m4tt3o.storable.common.repository.FileNodeRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Background task for cleaning up expired items in the trash.
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class TrashCleanupService {

    private final FileNodeRepository repository;
    private final ConfigService configService;

    /**
     * Runs every day at midnight to delete items older than the retention period.
     * Logic: find all nodes where is_deleted = true AND deleted_at < (now - retentionDays).
     */
    @Scheduled(cron = "0 0 0 * * *")
    @Transactional
    public void cleanupExpiredTrash() {
        log.info("Starting scheduled trash cleanup...");
        LocalDateTime cutoff = LocalDateTime.now(java.time.ZoneOffset.UTC).minusDays(configService.getTrashRetentionDays());
        
        // This is a simplified version. In a real system, you'd want to handle 
        // physical file deletion too via StorageService.
        List<FileNode> expiredNodes = repository.findAllDeleted().stream()
                .filter(node -> node.getDeletedAt() != null && node.getDeletedAt().isBefore(cutoff))
                .toList();

        log.info("Found {} expired nodes in trash. Permanently deleting...", expiredNodes.size());
        
        for (FileNode node : expiredNodes) {
            // repository.delete(node); 
            // Note: We might need recursive deletion here if it's a folder, 
            // but findAllDeleted() should ideally return all nodes.
            // However, softDeleteChildren already marks all descendants as deleted.
            repository.delete(node);
        }
        
        log.info("Trash cleanup completed.");
    }
}
