package dev.m4tt3o.storable.common.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "access_privileges")
@Getter
@Setter
@NoArgsConstructor
public class AccessPrivilege {

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

    public enum PrivilegeLevel {
        VIEW,
        EDIT,
        OWNER,
    }
}
