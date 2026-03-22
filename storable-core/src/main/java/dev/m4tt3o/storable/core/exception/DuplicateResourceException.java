package dev.m4tt3o.storable.core.exception;

import dev.m4tt3o.storable.common.exception.ErrorCode;

/**
 * Exception thrown when a resource with the same name already exists in a given context.
 */
public final class DuplicateResourceException extends StorableException {

    public DuplicateResourceException(String message) {
        super(ErrorCode.DUPLICATE_RESOURCE, message);
    }
}
