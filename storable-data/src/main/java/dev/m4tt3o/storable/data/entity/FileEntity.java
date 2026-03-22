package dev.m4tt3o.storable.data.entity;

import jakarta.persistence.Column;
import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

/**
 * File-specific entity implementation.
 */
@Entity
@DiscriminatorValue("file")
@Getter
@Setter
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
public class FileEntity extends NodeEntity {

    private Long size;

    private String mime;

    @Column(name = "storage_key")
    private String storageKey;
}
