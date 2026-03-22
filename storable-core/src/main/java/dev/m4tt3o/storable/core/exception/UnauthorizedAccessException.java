package dev.m4tt3o.storable.core.exception;

import dev.m4tt3o.storable.common.exception.ErrorCode;

/**
 * Exception thrown when a user attempts to access a resource without permission.
 */
public final class UnauthorizedAccessException extends StorableException {

    public UnauthorizedAccessException(String message) {
        super(ErrorCode.FORBIDDEN, message);
    }
}
