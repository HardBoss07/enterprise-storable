package dev.m4tt3o.storable.core.config;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@Data
@Configuration
@ConfigurationProperties(prefix = "storable.storage")
public class StorageProperties {
    private String uploadDir = "storage";
    private int trashRetentionDays = 30;
}
