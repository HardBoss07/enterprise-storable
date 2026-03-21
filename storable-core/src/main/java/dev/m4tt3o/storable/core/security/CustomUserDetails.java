package dev.m4tt3o.storable.core.security;

import dev.m4tt3o.storable.common.entity.UserRole;
import dev.m4tt3o.storable.core.domain.User;
import java.util.Collection;
import java.util.Collections;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

/**
 * Custom UserDetails implementation for Spring Security, using the User Domain Model.
 */
public record CustomUserDetails(
    String id,
    String username,
    String password,
    UserRole role
) implements UserDetails {
    /**
     * Factory method to create CustomUserDetails from a User Domain Model.
     */
    public static CustomUserDetails fromDomain(User user) {
        return new CustomUserDetails(
            user.id(),
            user.username(),
            user.password(),
            user.role()
        );
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return Collections.singletonList(
            new SimpleGrantedAuthority("ROLE_" + role.name())
        );
    }

    @Override
    public String getPassword() {
        return password;
    }

    @Override
    public String getUsername() {
        return username;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }
}
