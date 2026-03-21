package dev.m4tt3o.storable.core.service;

import dev.m4tt3o.storable.core.domain.User;
import dev.m4tt3o.storable.core.port.UserPersistencePort;
import dev.m4tt3o.storable.core.security.CustomUserDetails;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

/**
 * Implementation of Spring Security's UserDetailsService using the UserPersistencePort.
 */
@Service
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {

    private final UserPersistencePort userPersistencePort;

    @Override
    public UserDetails loadUserByUsername(String username)
        throws UsernameNotFoundException {
        User user = userPersistencePort
            .findByUsername(username)
            .orElseThrow(() ->
                new UsernameNotFoundException("User not found: " + username)
            );

        return CustomUserDetails.fromDomain(user);
    }
}
