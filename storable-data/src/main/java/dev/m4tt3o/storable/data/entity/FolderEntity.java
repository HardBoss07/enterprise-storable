package dev.m4tt3o.storable.data.entity;

import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

/**
 * Folder-specific entity implementation.
 */
@Entity
@DiscriminatorValue("folder")
@Getter
@Setter
@SuperBuilder
@NoArgsConstructor
public class FolderEntity extends NodeEntity {}
