package dev.m4tt3o.storable.data.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

/**
 * Persistence entity representing the 'nodes' table in MySQL.
 */
@Entity
@Table(name = "nodes")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FileEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    private Long size;

    private String mime;

    @Column(name = "storage_key")
    private String storageKey;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "modified_at")
    private LocalDateTime modifiedAt;

    @Column(name = "is_deleted", nullable = false)
    private boolean isDeleted = false;

    @Column(name = "deleted_at")
    private LocalDateTime deletedAt;

    @Column(name = "original_path")
    private String originalPath;

    @Column(name = "is_favorite", nullable = false)
    private boolean isFavorite = false;

    @Column(name = "owner_id", nullable = false)
    private String ownerId;

    @Column(name = "parent_id")
    private Long parentId;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private NodeKind kind;

    public enum NodeKind {
        file,
        folder,
    }
}
