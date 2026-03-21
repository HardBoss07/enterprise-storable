package dev.m4tt3o.storable.data.adapter;

import dev.m4tt3o.storable.core.domain.User;
import dev.m4tt3o.storable.core.port.UserPersistencePort;
import dev.m4tt3o.storable.data.entity.UserEntity;
import dev.m4tt3o.storable.data.mapper.UserMapper;
import dev.m4tt3o.storable.data.repository.UserRepository;
import java.util.List;
import java.util.Optional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

/**
 * Adapter (Driven) implementing the UserPersistencePort.
 */
@Component
@RequiredArgsConstructor
public class UserPersistenceAdapter implements UserPersistencePort {

    private final UserRepository userRepository;

    @Override
    public Optional<User> findById(String id) {
        return userRepository.findById(id).map(UserMapper::toDomain);
    }

    @Override
    public Optional<User> findByUsername(String username) {
        return userRepository
            .findByUsername(username)
            .map(UserMapper::toDomain);
    }

    @Override
    public Optional<User> findByEmail(String email) {
        return userRepository.findByEmail(email).map(UserMapper::toDomain);
    }

    @Override
    public boolean existsByEmail(String email) {
        return userRepository.existsByEmail(email);
    }

    @Override
    public boolean existsByUsername(String username) {
        return userRepository.existsByUsername(username);
    }

    @Override
    public User save(User user) {
        UserEntity entity = UserMapper.toEntity(user);
        UserEntity saved = userRepository.save(entity);
        return UserMapper.toDomain(saved);
    }

    @Override
    public List<User> searchUsers(String query) {
        return userRepository
            .searchUsers(query)
            .stream()
            .map(UserMapper::toDomain)
            .toList();
    }

    @Override
    public void deleteById(String id) {
        userRepository.deleteById(id);
    }
}
