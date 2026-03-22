package dev.m4tt3o.storable.core.exception;

import dev.m4tt3o.storable.common.exception.ErrorCode;

/**
 * Exception thrown when a requested resource is not found.
 */
public final class ResourceNotFoundException extends StorableException {

    public ResourceNotFoundException(String message) {
        super(ErrorCode.NOT_FOUND, message);
    }
}
