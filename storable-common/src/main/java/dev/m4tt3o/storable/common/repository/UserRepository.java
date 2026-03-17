package dev.m4tt3o.storable.common.repository;

import dev.m4tt3o.storable.common.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, String> {
    Optional<User> findByUsername(String username);
    Optional<User> findByEmail(String email);
    boolean existsByUsername(String username);
    boolean existsByEmail(String email);
    
    @org.springframework.data.jpa.repository.Query("SELECT u FROM User u WHERE u.username LIKE %:query% OR u.email LIKE %:query%")
    java.util.List<User> searchUsers(String query);
}
