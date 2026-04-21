package dev.m4tt3o.storable.api.security;

import java.io.IOException;
import lombok.RequiredArgsConstructor;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final dev.m4tt3o.storable.core.security.JwtService jwtService;
    private final org.springframework.security.core.userdetails.UserDetailsService userDetailsService;
    private final dev.m4tt3o.storable.core.service.SessionService sessionService;

    @Override
    protected void doFilterInternal(
        @NonNull jakarta.servlet.http.HttpServletRequest request,
        @NonNull jakarta.servlet.http.HttpServletResponse response,
        @NonNull jakarta.servlet.FilterChain filterChain
    ) throws jakarta.servlet.ServletException, IOException {
        final String authHeader = request.getHeader("Authorization");
        final String jwt;
        final String username;

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        jwt = authHeader.substring(7);

        try {
            username = jwtService.extractUsername(jwt);
            if (
                username != null &&
                org.springframework.security.core.context.SecurityContextHolder.getContext().getAuthentication() ==
                null
            ) {
                org.springframework.security.core.userdetails.UserDetails userDetails =
                    this.userDetailsService.loadUserByUsername(username);

                if (jwtService.isTokenValid(jwt, userDetails.getUsername())) {
                    String userId = null;
                    if (
                        userDetails instanceof
                            dev.m4tt3o.storable.core.security.CustomUserDetails custom
                    ) {
                        userId = custom.id();
                    }

                    java.util.Date issuedAt = jwtService.extractIssuedAt(jwt);

                    if (
                        userId != null &&
                        sessionService.isSessionValid(
                            userId,
                            issuedAt.toInstant()
                        )
                    ) {
                        org.springframework.security.authentication.UsernamePasswordAuthenticationToken authToken =
                            new org.springframework.security.authentication.UsernamePasswordAuthenticationToken(
                                userId,
                                null,
                                userDetails.getAuthorities()
                            );
                        authToken.setDetails(
                            new org.springframework.security.web.authentication.WebAuthenticationDetailsSource().buildDetails(
                                request
                            )
                        );
                        org.springframework.security.core.context.SecurityContextHolder.getContext().setAuthentication(
                            authToken
                        );
                    }
                }
            }
        } catch (Exception e) {
            // Log or ignore, just don't set authentication
        }

        filterChain.doFilter(request, response);
    }
}
