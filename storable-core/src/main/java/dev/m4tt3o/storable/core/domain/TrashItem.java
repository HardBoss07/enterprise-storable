package dev.m4tt3o.storable.core.domain;

/**
 * Domain Model for an item in the trash.
 */
public record TrashItem(Storable item, long daysRemaining) {}
