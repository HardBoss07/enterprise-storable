package dev.m4tt3o.storable.data.mapper;

import dev.m4tt3o.storable.core.domain.User;
import dev.m4tt3o.storable.data.entity.UserEntity;
import lombok.experimental.UtilityClass;

/**
 * Maps between the persistence UserEntity and the core Domain Model User.
 * This is the only place that should bridge the 'data' and 'core' modules.
 */
@UtilityClass
public class UserMapper {

    /**
     * Maps a UserEntity (Persistence) to its domain counterpart User (Core).
     */
    public static User toDomain(UserEntity entity) {
        if (entity == null) {
            return null;
        }

        return User.builder()
            .id(entity.getId())
            .username(entity.getUsername())
            .password(entity.getPassword())
            .email(entity.getEmail())
            .role(entity.getRole())
            .build();
    }

    /**
     * Maps a Domain Model User (Core) to its persistence counterpart UserEntity (Persistence).
     */
    public static UserEntity toEntity(User domain) {
        if (domain == null) {
            return null;
        }

        return UserEntity.builder()
            .id(domain.id())
            .username(domain.username())
            .password(domain.password())
            .email(domain.email())
            .role(domain.role())
            .build();
    }
}
