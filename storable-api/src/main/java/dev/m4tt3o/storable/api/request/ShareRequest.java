package dev.m4tt3o.storable.api.request;

import dev.m4tt3o.storable.common.entity.PrivilegeLevel;

public record ShareRequest(String targetUserId, PrivilegeLevel level) {}
