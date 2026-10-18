package security;

import auth.CustomUserDetailsService;
import com.fasterxml.jackson.databind.ObjectMapper;
import io.jsonwebtoken.JwtException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.time.Instant;
import java.util.LinkedHashMap;
import java.util.Map;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtService jwtService;
    private final CustomUserDetailsService userDetailsService;
    private final ObjectMapper objectMapper = new ObjectMapper();

    public JwtAuthenticationFilter(JwtService jwtService, CustomUserDetailsService userDetailsService) {
        this.jwtService = jwtService;
        this.userDetailsService = userDetailsService;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {

        final String authHeader = request.getHeader(HttpHeaders.AUTHORIZATION);

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        final String jwt = authHeader.substring(7);

        // Explicit check against blacklisted tokens (e.g. revoked on logout)
        if (jwtService.isTokenBlacklisted(jwt)) {
            writeUnauthorizedResponse(response, "Token de autenticación revocado o sesión cerrada.", request.getRequestURI());
            return;
        }

        final String username;
        try {
            username = jwtService.extractUsername(jwt);
        } catch (JwtException | IllegalArgumentException e) {
            writeUnauthorizedResponse(response, "Token JWT inválido o expirado.", request.getRequestURI());
            return;
        }

        if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            try {
                UserDetails userDetails = userDetailsService.loadUserByUsername(username);

                if (jwtService.isTokenValid(jwt, userDetails)) {
                    UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                            userDetails, null, userDetails.getAuthorities()
                    );
                    authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                    SecurityContextHolder.getContext().setAuthentication(authToken);
                }
            } catch (UsernameNotFoundException e) {
                writeUnauthorizedResponse(response, "Usuario asociado al token no existe.", request.getRequestURI());
                return;
            }
        }

        filterChain.doFilter(request, response);
    }

    private void writeUnauthorizedResponse(HttpServletResponse response, String message, String path) throws IOException {
        response.setStatus(HttpStatus.UNAUTHORIZED.value());
        response.setContentType(MediaType.APPLICATION_JSON_VALUE);

        Map<String, Object> errorDetails = new LinkedHashMap<>();
        errorDetails.put("timestamp", Instant.now().toString());
        errorDetails.put("status", HttpStatus.UNAUTHORIZED.value());
        errorDetails.put("error", "Unauthorized");
        errorDetails.put("message", message);
        errorDetails.put("path", path);

        objectMapper.writeValue(response.getOutputStream(), errorDetails);
    }
}
