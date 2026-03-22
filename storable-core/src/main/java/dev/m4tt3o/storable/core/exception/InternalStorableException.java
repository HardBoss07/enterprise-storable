package dev.m4tt3o.storable.core.exception;

import dev.m4tt3o.storable.common.exception.ErrorCode;

/**
 * Exception thrown for unexpected server-side errors within the Storable core.
 */
public final class InternalStorableException extends StorableException {

    public InternalStorableException(String message) {
        super(ErrorCode.INTERNAL_SERVER_ERROR, message);
    }

    public InternalStorableException(ErrorCode errorCode, String message) {
        super(errorCode, message);
    }
}
