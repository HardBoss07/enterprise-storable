package dev.m4tt3o.storable.core.exception;

import dev.m4tt3o.storable.common.exception.ErrorCode;
import lombok.Getter;

/**
 * Base sealed exception for the Storable platform.
 * Ensures the API layer can handle all domain errors exhaustively.
 */
@Getter
public sealed class StorableException
    extends RuntimeException
    permits
        ResourceNotFoundException,
        UnauthorizedAccessException,
        DuplicateResourceException,
        StorageFullException,
        InternalStorableException
{

    private final ErrorCode errorCode;

    public StorableException(ErrorCode errorCode, String message) {
        super(message != null ? message : errorCode.getDefaultMessage());
        this.errorCode = errorCode;
    }

    public StorableException(ErrorCode errorCode) {
        this(errorCode, errorCode.getDefaultMessage());
    }
}
