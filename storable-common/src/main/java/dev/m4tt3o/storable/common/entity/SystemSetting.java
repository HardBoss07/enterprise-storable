package dev.m4tt3o.storable.common.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "system_settings")
@Getter
@Setter
@NoArgsConstructor
public class SystemSetting {

    @Id
    @Column(name = "setting_key")
    private String settingKey;

    @Column(name = "setting_value", nullable = false)
    private String settingValue;

    public SystemSetting(String key, String value) {
        this.settingKey = key;
        this.settingValue = value;
    }
}
