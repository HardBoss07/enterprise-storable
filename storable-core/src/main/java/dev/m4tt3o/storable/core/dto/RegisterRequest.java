package dev.m4tt3o.storable.core.dto;

public record RegisterRequest(
    String username,
    String email,
    String password
) {}
