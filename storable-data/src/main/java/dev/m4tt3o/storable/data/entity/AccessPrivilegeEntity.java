package dev.m4tt3o.storable.data.entity;

import dev.m4tt3o.storable.common.entity.PrivilegeLevel;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * Persistence entity representing the 'access_privileges' table in MySQL.
 */
@Entity
@Table(name = "access_privileges")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AccessPrivilegeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "node_id", nullable = false)
    private Long nodeId;

    @Column(name = "user_id", nullable = false)
    private String userId;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private PrivilegeLevel level;
}
