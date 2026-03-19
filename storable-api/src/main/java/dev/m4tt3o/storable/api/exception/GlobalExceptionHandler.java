package dev.m4tt3o.storable.api.exception;

import java.util.Map;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

/**
 * Centralized exception handling for all REST controllers.
 */
@Slf4j
@RestControllerAdvice
public class GlobalExceptionHandler {

    /** Handles RuntimeExceptions and returns a 500 status. */
    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<Map<String, String>> handleRuntimeException(
        RuntimeException e
    ) {
        log.error(
            "Server Error [{}]: {}",
            e.getClass().getSimpleName(),
            e.getMessage(),
            e
        );
        return ResponseEntity.status(500).body(
            Map.of(
                "error",
                e.getMessage() != null
                    ? e.getMessage()
                    : "Internal Server Error",
                "type",
                e.getClass().getSimpleName()
            )
        );
    }

    /** Handles all other Exceptions. */
    @ExceptionHandler(Exception.class)
    public ResponseEntity<Map<String, String>> handleException(Exception e) {
        log.error(
            "Unexpected Error [{}]: {}",
            e.getClass().getSimpleName(),
            e.getMessage(),
            e
        );
        return ResponseEntity.status(500).body(
            Map.of(
                "error",
                "An unexpected error occurred",
                "type",
                e.getClass().getSimpleName()
            )
        );
    }
}
