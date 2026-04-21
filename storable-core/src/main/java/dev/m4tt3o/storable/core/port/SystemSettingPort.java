package dev.m4tt3o.storable.core.port;

import java.util.Optional;

public interface SystemSettingPort {
    Optional<String> getSetting(String key);
    void saveSetting(String key, String value);
}
