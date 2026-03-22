package dev.m4tt3o.storable.api.exception;

import dev.m4tt3o.storable.common.exception.ErrorCode;
import dev.m4tt3o.storable.common.exception.ErrorResponse;
import dev.m4tt3o.storable.core.exception.*;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

/**
 * Centralized exception handling for all REST controllers.
 * Uses Java 21 Pattern Matching and Switch Expressions for clean mapping.
 */
@Slf4j
@RestControllerAdvice
public class GlobalExceptionHandler {

    /**
     * Handles the sealed StorableException hierarchy.
     */
    @ExceptionHandler(StorableException.class)
    public ResponseEntity<ErrorResponse> handleStorableException(
        StorableException e
    ) {
        log.warn(
            "Domain Error [{}]: {}",
            e.getErrorCode().getCode(),
            e.getMessage()
        );

        HttpStatus status = switch (e) {
            case ResourceNotFoundException ex -> HttpStatus.NOT_FOUND;
            case UnauthorizedAccessException ex -> HttpStatus.FORBIDDEN;
            case DuplicateResourceException ex -> HttpStatus.CONFLICT;
            case StorageFullException ex -> HttpStatus.PAYLOAD_TOO_LARGE;
            case InternalStorableException ex -> HttpStatus.INTERNAL_SERVER_ERROR;
            default -> HttpStatus.INTERNAL_SERVER_ERROR;
        };

        return ResponseEntity.status(status).body(
            new ErrorResponse(
                e.getErrorCode(),
                e.getMessage(),
                e.getClass().getSimpleName()
            )
        );
    }

    /**
     * Fallback for generic RuntimeExceptions.
     */
    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<ErrorResponse> handleRuntimeException(
        RuntimeException e
    ) {
        log.error("Unhandled Runtime Exception: ", e);
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
            new ErrorResponse(
                ErrorCode.INTERNAL_SERVER_ERROR,
                "An unexpected server error occurred.",
                "RuntimeException"
            )
        );
    }

    /**
     * Fallback for all other Exceptions.
     */
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> handleException(Exception e) {
        log.error("Unhandled Exception: ", e);
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
            new ErrorResponse(
                ErrorCode.INTERNAL_SERVER_ERROR,
                "An unexpected error occurred.",
                "Exception"
            )
        );
    }
}
