package dev.m4tt3o.storable.api.exception;

import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.Map;

/**
 * Centralized exception handling for all REST controllers.
 */
@Slf4j
@RestControllerAdvice
public class GlobalExceptionHandler {

    /** Handles RuntimeExceptions and returns a 500 status. */
    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<Map<String, String>> handleRuntimeException(RuntimeException e) {
        log.error("An unexpected Server error occurred: {}", e.getMessage(), e);
        return ResponseEntity.status(500).body(Map.of("error", e.getMessage()));
    }
}
