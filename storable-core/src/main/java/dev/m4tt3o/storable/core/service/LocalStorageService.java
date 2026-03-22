package dev.m4tt3o.storable.core.service;

import dev.m4tt3o.storable.common.exception.ErrorCode;
import dev.m4tt3o.storable.core.config.StorageProperties;
import dev.m4tt3o.storable.core.exception.InternalStorableException;
import jakarta.annotation.PostConstruct;
import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

/**
 * Implementation of StorageService for local file system storage.
 * Throws InternalStorableException with STORAGE_FAILURE for all I/O errors.
 */
@Service
@RequiredArgsConstructor
public class LocalStorageService implements StorageService {

    private final StorageProperties storageProperties;
    private Path rootLocation;

    @PostConstruct
    public void init() {
        this.rootLocation = Paths.get(storageProperties.getUploadDir());
        try {
            Files.createDirectories(rootLocation);
        } catch (IOException e) {
            throw new InternalStorableException(
                ErrorCode.STORAGE_FAILURE,
                "Could not initialize storage."
            );
        }
    }

    @Override
    public void store(InputStream inputStream, String storageKey) {
        try {
            Path destinationFile = this.rootLocation.resolve(
                    Paths.get(storageKey)
                )
                .normalize()
                .toAbsolutePath();

            if (
                !destinationFile
                    .getParent()
                    .startsWith(this.rootLocation.toAbsolutePath())
            ) {
                throw new InternalStorableException(
                    ErrorCode.STORAGE_FAILURE,
                    "Cannot store file outside root directory."
                );
            }

            Files.createDirectories(destinationFile.getParent());
            Files.copy(
                inputStream,
                destinationFile,
                StandardCopyOption.REPLACE_EXISTING
            );
        } catch (IOException e) {
            throw new InternalStorableException(
                ErrorCode.STORAGE_FAILURE,
                "Failed to store file: " + storageKey
            );
        }
    }

    @Override
    public InputStream load(String storageKey) {
        try {
            Path file = rootLocation.resolve(storageKey);
            return Files.newInputStream(file);
        } catch (IOException e) {
            throw new InternalStorableException(
                ErrorCode.STORAGE_FAILURE,
                "Could not read file: " + storageKey
            );
        }
    }

    @Override
    public void delete(String storageKey) {
        try {
            Path file = rootLocation.resolve(storageKey);
            Files.deleteIfExists(file);
        } catch (IOException e) {
            throw new InternalStorableException(
                ErrorCode.STORAGE_FAILURE,
                "Could not delete file: " + storageKey
            );
        }
    }

    @Override
    public void copy(String sourceKey, String destinationKey) {
        try {
            Path sourceFile = this.rootLocation.resolve(Paths.get(sourceKey))
                .normalize()
                .toAbsolutePath();
            Path destinationFile = this.rootLocation.resolve(
                    Paths.get(destinationKey)
                )
                .normalize()
                .toAbsolutePath();

            if (
                !destinationFile
                    .getParent()
                    .startsWith(this.rootLocation.toAbsolutePath())
            ) {
                throw new InternalStorableException(
                    ErrorCode.STORAGE_FAILURE,
                    "Cannot copy file outside root directory."
                );
            }

            Files.createDirectories(destinationFile.getParent());
            Files.copy(
                sourceFile,
                destinationFile,
                StandardCopyOption.REPLACE_EXISTING
            );
        } catch (IOException e) {
            throw new InternalStorableException(
                ErrorCode.STORAGE_FAILURE,
                "Failed to copy file from " +
                    sourceKey +
                    " to " +
                    destinationKey
            );
        }
    }

    @Override
    public Path getPath(String storageKey) {
        return rootLocation.resolve(storageKey);
    }
}
