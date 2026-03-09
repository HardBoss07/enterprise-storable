package dev.m4tt3o.storable.core.dto;

public record AuthResponse(
    String token,
    String username,
    String role
) {}
