package dev.m4tt3o.storable.common.exception;

import lombok.Getter;

/**
 * Standardized Error Codes for the Storable platform.
 */
@Getter
public enum ErrorCode {
    // Client Errors
    BAD_REQUEST("ERR_400", "The request is malformed or invalid."),
    UNAUTHORIZED(
        "ERR_401",
        "Authentication is required to access this resource."
    ),
    FORBIDDEN("ERR_403", "You do not have permission to perform this action."),
    NOT_FOUND("ERR_404", "The requested resource was not found."),
    CONFLICT(
        "ERR_409",
        "A conflict occurred with the current state of the resource."
    ),

    // Business Errors
    STORAGE_FULL("ERR_STORAGE_01", "Storage quota exceeded."),
    DUPLICATE_RESOURCE(
        "ERR_RESOURCE_01",
        "A resource with this name already exists in the destination."
    ),
    INVALID_PATH("ERR_PATH_01", "The provided path is invalid or restricted."),

    // Server Errors
    INTERNAL_SERVER_ERROR(
        "ERR_500",
        "An unexpected error occurred on the server."
    ),
    STORAGE_FAILURE(
        "ERR_STORAGE_500",
        "Failed to interact with the physical storage layer."
    );

    private final String code;
    private final String defaultMessage;

    ErrorCode(String code, String defaultMessage) {
        this.code = code;
        this.defaultMessage = defaultMessage;
    }
}
