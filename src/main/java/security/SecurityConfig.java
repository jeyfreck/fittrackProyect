package security;

import auth.CustomUserDetailsService;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.MediaType;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.web.header.writers.ReferrerPolicyHeaderWriter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.time.Instant;
import java.util.Arrays;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Configuration
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthFilter;
    private final RateLimitingFilter rateLimitingFilter;
    private final CustomUserDetailsService userDetailsService;

    @Value("${app.cors.allowed-origins:http://localhost:5173,http://localhost:3000,http://127.0.0.1:5173}")
    private String allowedOriginsProperty;

    public SecurityConfig(
            JwtAuthenticationFilter jwtAuthFilter,
            RateLimitingFilter rateLimitingFilter,
            CustomUserDetailsService userDetailsService
    ) {
        this.jwtAuthFilter = jwtAuthFilter;
        this.rateLimitingFilter = rateLimitingFilter;
        this.userDetailsService = userDetailsService;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        return http
                .csrf(csrf -> csrf.disable())
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                // HTTP Security Headers Hardening
                .headers(headers -> headers
                        .frameOptions(frame -> frame.deny()) // Anti-Clickjacking
                        .contentTypeOptions(content -> {}) // X-Content-Type-Options: nosniff
                        .contentSecurityPolicy(csp -> csp.policyDirectives(
                                "default-src 'self'; " +
                                "script-src 'self' 'unsafe-inline' 'unsafe-eval'; " +
                                "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; " +
                                "font-src 'self' data: https://fonts.gstatic.com; " +
                                "img-src 'self' data: blob: https:; " +
                                "connect-src 'self' http://localhost:* ws://localhost:* https:; " +
                                "frame-ancestors 'none';"
                        ))
                        .referrerPolicy(ref -> ref.policy(ReferrerPolicyHeaderWriter.ReferrerPolicy.STRICT_ORIGIN_WHEN_CROSS_ORIGIN))
                )
                // Sanitized JSON Security Exception Responses (Prevents Stack Trace Leaks)
                .exceptionHandling(ex -> ex
                        .authenticationEntryPoint((request, response, authException) -> {
                            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                            response.setContentType(MediaType.APPLICATION_JSON_VALUE);
                            Map<String, Object> body = new LinkedHashMap<>();
                            body.put("timestamp", Instant.now().toString());
                            body.put("status", HttpServletResponse.SC_UNAUTHORIZED);
                            body.put("error", "Unauthorized");
                            body.put("message", "Acceso denegado: Token de autenticación ausente o inválido.");
                            body.put("path", request.getRequestURI());
                            new ObjectMapper().writeValue(response.getOutputStream(), body);
                        })
                        .accessDeniedHandler((request, response, accessDeniedException) -> {
                            response.setStatus(HttpServletResponse.SC_FORBIDDEN);
                            response.setContentType(MediaType.APPLICATION_JSON_VALUE);
                            Map<String, Object> body = new LinkedHashMap<>();
                            body.put("timestamp", Instant.now().toString());
                            body.put("status", HttpServletResponse.SC_FORBIDDEN);
                            body.put("error", "Forbidden");
                            body.put("message", "Permisos insuficientes para acceder a este recurso.");
                            body.put("path", request.getRequestURI());
                            new ObjectMapper().writeValue(response.getOutputStream(), body);
                        })
                )
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers(
                                "/api/auth/**",
                                "/swagger-ui/**",
                                "/swagger-ui.html",
                                "/api-docs/**",
                                "/v3/api-docs/**"
                        ).permitAll()
                        .anyRequest().authenticated()
                )
                .sessionManagement(sess -> sess.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authenticationProvider(authenticationProvider())
                // Register RateLimitingFilter and JwtAuthenticationFilter
                .addFilterBefore(rateLimitingFilter, UsernamePasswordAuthenticationFilter.class)
                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class)
                .build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();

        List<String> origins = Arrays.stream(allowedOriginsProperty.split(","))
                .map(String::trim)
                .filter(origin -> !origin.isEmpty())
                .collect(Collectors.toList());

        // Enterprise CORS: Explicit trusted origins with credentials
        configuration.setAllowedOrigins(origins);
        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(List.of(
                "Authorization",
                "Content-Type",
                "Accept",
                "X-Requested-With",
                "Origin",
                "Access-Control-Request-Method",
                "Access-Control-Request-Headers"
        ));
        configuration.setExposedHeaders(List.of(
                "Authorization",
                "Retry-After",
                "X-RateLimit-Limit",
                "X-RateLimit-Remaining"
        ));
        configuration.setAllowCredentials(true);
        configuration.setMaxAge(3600L);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

    @Bean
    public AuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider provider = new DaoAuthenticationProvider();
        provider.setUserDetailsService(userDetailsService);
        provider.setPasswordEncoder(passwordEncoder());
        return provider;
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
