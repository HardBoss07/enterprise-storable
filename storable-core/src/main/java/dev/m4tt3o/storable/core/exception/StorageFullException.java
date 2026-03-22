package dev.m4tt3o.storable.core.exception;

import dev.m4tt3o.storable.common.exception.ErrorCode;

/**
 * Exception thrown when a user's storage quota is exceeded.
 */
public final class StorageFullException extends StorableException {

    public StorageFullException(String message) {
        super(ErrorCode.STORAGE_FULL, message);
    }
}
