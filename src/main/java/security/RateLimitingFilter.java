package security;

import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.time.Instant;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicInteger;

/**
 * Enterprise Rate Limiting Filter to prevent Brute-Force and Denial of Service (DoS) attacks.
 * Tracks requests per IP address using a 60-second sliding window.
 */
@Component
public class RateLimitingFilter extends OncePerRequestFilter {

    @Value("${app.security.rate-limit.max-per-minute:30}")
    private int maxRequestsPerMinute;

    private static class RequestTracker {
        final long windowStart;
        final AtomicInteger count;

        RequestTracker(long windowStart) {
            this.windowStart = windowStart;
            this.count = new AtomicInteger(1);
        }
    }

    private final ConcurrentHashMap<String, RequestTracker> clientRequests = new ConcurrentHashMap<>();
    private final ObjectMapper objectMapper = new ObjectMapper();

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        String path = request.getRequestURI();

        // Rate limiting is strictly enforced on authentication and credential endpoints
        if (path.startsWith("/api/auth/")) {
            String clientIp = extractClientIp(request);
            long currentTime = System.currentTimeMillis();

            // Periodic cleanup of stale tracking entries older than 2 minutes
            if (clientRequests.size() > 5000) {
                clientRequests.entrySet().removeIf(entry -> (currentTime - entry.getValue().windowStart) > 120_000);
            }

            RequestTracker tracker = clientRequests.compute(clientIp, (key, existing) -> {
                if (existing == null || (currentTime - existing.windowStart) > 60_000) {
                    return new RequestTracker(currentTime);
                } else {
                    existing.count.incrementAndGet();
                    return existing;
                }
            });

            if (tracker.count.get() > maxRequestsPerMinute) {
                response.setStatus(HttpStatus.TOO_MANY_REQUESTS.value());
                response.setContentType(MediaType.APPLICATION_JSON_VALUE);
                response.setHeader("Retry-After", "60");
                response.setHeader("X-RateLimit-Limit", String.valueOf(maxRequestsPerMinute));
                response.setHeader("X-RateLimit-Remaining", "0");

                Map<String, Object> errorDetails = new LinkedHashMap<>();
                errorDetails.put("timestamp", Instant.now().toString());
                errorDetails.put("status", HttpStatus.TOO_MANY_REQUESTS.value());
                errorDetails.put("error", "Too Many Requests");
                errorDetails.put("message", "Límite de peticiones excedido (Anti-Brute Force Protection). Por favor espere un momento antes de reintentar.");
                errorDetails.put("retryAfterSeconds", 60);
                errorDetails.put("path", path);

                objectMapper.writeValue(response.getOutputStream(), errorDetails);
                return;
            }

            response.setHeader("X-RateLimit-Limit", String.valueOf(maxRequestsPerMinute));
            response.setHeader("X-RateLimit-Remaining", String.valueOf(Math.max(0, maxRequestsPerMinute - tracker.count.get())));
        }

        filterChain.doFilter(request, response);
    }

    /**
     * Resolves the true client IP even if operating behind reverse proxies, load balancers, or Cloudflare.
     */
    private String extractClientIp(HttpServletRequest request) {
        String xForwardedFor = request.getHeader("X-Forwarded-For");
        if (xForwardedFor != null && !xForwardedFor.isBlank() && !"unknown".equalsIgnoreCase(xForwardedFor)) {
            // First IP in comma-separated list is the original client
            return xForwardedFor.split(",")[0].trim();
        }
        String xRealIp = request.getHeader("X-Real-IP");
        if (xRealIp != null && !xRealIp.isBlank() && !"unknown".equalsIgnoreCase(xRealIp)) {
            return xRealIp.trim();
        }
        return request.getRemoteAddr();
    }
}
