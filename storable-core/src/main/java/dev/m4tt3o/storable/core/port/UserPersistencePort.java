package dev.m4tt3o.storable.core.port;

import dev.m4tt3o.storable.core.domain.User;
import java.util.List;
import java.util.Optional;

/**
 * Port (Outbound) for User persistence operations.
 */
public interface UserPersistencePort {
    /**
     * Finds a user by their unique identifier.
     */
    Optional<User> findById(String id);

    /**
     * Finds a user by their username.
     */
    Optional<User> findByUsername(String username);

    /**
     * Finds a user by their email address.
     */
    Optional<User> findByEmail(String email);

    /**
     * Checks if a user exists with a given email.
     */
    boolean existsByEmail(String email);

    /**
     * Checks if a user exists with a given username.
     */
    boolean existsByUsername(String username);

    /**
     * Saves or updates a user.
     */
    User save(User user);

    /**
     * Searches for users by a query string.
     */
    List<User> searchUsers(String query);

    /**
     * Deletes a user by their unique identifier.
     */
    void deleteById(String id);
}
