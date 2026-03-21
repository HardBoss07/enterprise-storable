package dev.m4tt3o.storable.data.repository;

import dev.m4tt3o.storable.data.entity.UserEntity;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

/**
 * Persistence repository for 'users' table.
 */
@Repository
public interface UserRepository extends JpaRepository<UserEntity, String> {
    /**
     * Find a user by their username.
     */
    Optional<UserEntity> findByUsername(String username);

    /**
     * Find a user by their email.
     */
    Optional<UserEntity> findByEmail(String email);

    /**
     * Check if a user exists with a given username.
     */
    boolean existsByUsername(String username);

    /**
     * Check if a user exists with a given email.
     */
    boolean existsByEmail(String email);

    /**
     * Search users by username or email.
     */
    @Query(
        "SELECT u FROM UserEntity u WHERE u.username LIKE %:query% OR u.email LIKE %:query%"
    )
    java.util.List<UserEntity> searchUsers(String query);
}
