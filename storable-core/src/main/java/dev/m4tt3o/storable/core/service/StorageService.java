package dev.m4tt3o.storable.core.service;

import java.io.InputStream;
import java.nio.file.Path;

public interface StorageService {
    void store(InputStream inputStream, String storageKey);
    InputStream load(String storageKey);
    void delete(String storageKey);
    Path getPath(String storageKey);
}
