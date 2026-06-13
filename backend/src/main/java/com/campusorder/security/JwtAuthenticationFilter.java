package com.campusorder.security;

import com.campusorder.repository.UserRepository;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtService jwtService;
    private final UserRepository userRepository;

    public JwtAuthenticationFilter(JwtService jwtService,
            UserRepository userRepository) {
        this.jwtService = jwtService;
        this.userRepository = userRepository;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain)
            throws ServletException, IOException {

        String authHeader = request.getHeader("Authorization");

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        String token = authHeader.substring(7);
        String email = jwtService.extractEmail(token);

        if (email != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            userRepository.findByEmail(email).ifPresent(user -> {
                if (jwtService.isTokenValid(token)) {

                    System.out.println("=================================");
                    System.out.println("EMAIL: " + user.getEmail());
                    System.out.println("ROLE BD: " + user.getRole());
                    System.out.println("AUTHORITY: ROLE_" + user.getRole());
                    System.out.println("=================================");

                    UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(
                            user,
                            null,
                            List.of(new SimpleGrantedAuthority("ROLE_" + user.getRole())));

                    SecurityContextHolder.getContext().setAuthentication(authentication);
                }
            });
        }

        System.out.println("REQUEST URI: " + request.getRequestURI());

        if (SecurityContextHolder.getContext().getAuthentication() != null) {
            System.out.println(
                "AUTH USER: " +
                SecurityContextHolder.getContext().getAuthentication().getName()
            );

            System.out.println(
                "AUTHORITIES: " +
                SecurityContextHolder.getContext().getAuthentication().getAuthorities()
            );
        }

        filterChain.doFilter(request, response);
    }
}