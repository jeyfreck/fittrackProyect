package security;

import entity.User;
import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.function.Function;

@Service
public class JwtService {

    @Value("${app.jwt.secret:c3VwZXItc2VjdXJlLWZpdHRyYWNrLTNkLWN5YmVybmV0aWMtcHJvamVjdC1rZXktMjAyNi0yNTYtYml0cw==}")
    private String secretKey;

    @Value("${app.jwt.expiration:3600000}")
    private Long jwtExpiration;

    @Value("${app.jwt.refresh-expiration:604800000}")
    private Long refreshExpiration;

    /**
     * In-memory store for revoked / logged-out tokens mapped to their expiration timestamp.
     * Tokens are retained only until their natural expiration.
     */
    private final Map<String, Long> blacklistedTokens = new ConcurrentHashMap<>();

    public String extractUsername(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }

    public String generateToken(User user) {
        Map<String, Object> extraClaims = new HashMap<>();
        if (user.getRole() != null) {
            extraClaims.put("role", user.getRole());
        }
        if (user.getName() != null) {
            extraClaims.put("name", user.getName());
        }
        return buildToken(extraClaims, user.getEmail(), jwtExpiration);
    }

    public String generateToken(Map<String, Object> extraClaims, UserDetails userDetails) {
        return buildToken(extraClaims, userDetails.getUsername(), jwtExpiration);
    }

    public String generateRefreshToken(User user) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("token_type", "REFRESH");
        return buildToken(claims, user.getEmail(), refreshExpiration);
    }

    private String buildToken(Map<String, Object> claims, String subject, Long expirationTime) {
        long now = System.currentTimeMillis();
        return Jwts.builder()
                .setClaims(claims)
                .setSubject(subject)
                .setIssuedAt(new Date(now))
                .setExpiration(new Date(now + expirationTime))
                .signWith(getSignKey(), SignatureAlgorithm.HS256)
                .compact();
    }

    public boolean isTokenExpired(String token) {
        try {
            return extractExpiration(token).before(new Date());
        } catch (ExpiredJwtException e) {
            return true;
        } catch (JwtException e) {
            return true;
        }
    }

    public Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }

    public boolean isTokenValid(String token, UserDetails userDetails) {
        if (token == null || isTokenBlacklisted(token)) {
            return false;
        }
        try {
            final String username = extractUsername(token);
            return (username.equals(userDetails.getUsername()) && !isTokenExpired(token));
        } catch (JwtException | IllegalArgumentException e) {
            return false;
        }
    }

    /**
     * Marks a token as blacklisted so it cannot be used again after logout.
     */
    public void blacklistToken(String token) {
        try {
            Date exp = extractExpiration(token);
            blacklistedTokens.put(token, exp.getTime());
            cleanExpiredBlacklistEntries();
        } catch (Exception e) {
            // If already expired or malformed, store with default 1-hour window
            blacklistedTokens.put(token, System.currentTimeMillis() + 3600_000);
        }
    }

    public boolean isTokenBlacklisted(String token) {
        if (token == null) return true;
        Long exp = blacklistedTokens.get(token);
        if (exp == null) return false;
        if (exp < System.currentTimeMillis()) {
            blacklistedTokens.remove(token);
            return false;
        }
        return true;
    }

    private void cleanExpiredBlacklistEntries() {
        long now = System.currentTimeMillis();
        if (blacklistedTokens.size() > 500) {
            blacklistedTokens.entrySet().removeIf(entry -> entry.getValue() < now);
        }
    }

    private Claims extractAllClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(getSignKey())
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    private SecretKey getSignKey() {
        byte[] keyBytes = secretKey.getBytes(StandardCharsets.UTF_8);
        return Keys.hmacShaKeyFor(keyBytes);
    }
}
