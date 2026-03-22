package dev.m4tt3o.storable.common.exception;

import java.time.Instant;

/**
 * Standardized API Error Response.
 */
public record ErrorResponse(
    Instant timestamp,
    String code,
    String message,
    String type
) {
    public ErrorResponse(ErrorCode errorCode, String message, String type) {
        this(Instant.now(), errorCode.getCode(), message, type);
    }
}
