package dev.m4tt3o.storable.data.adapter;

import dev.m4tt3o.storable.common.entity.SystemSetting;
import dev.m4tt3o.storable.common.repository.SystemSettingRepository;
import dev.m4tt3o.storable.core.port.SystemSettingPort;
import java.util.Optional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class SystemSettingAdapter implements SystemSettingPort {

    private final SystemSettingRepository repository;

    @Override
    public Optional<String> getSetting(String key) {
        return repository.findById(key).map(SystemSetting::getSettingValue);
    }

    @Override
    public void saveSetting(String key, String value) {
        repository.save(new SystemSetting(key, value));
    }
}
