package auth;

import entity.User;
import io.jsonwebtoken.Claims;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.Map;
import java.util.function.Function;

/**
 * Backward-compatible delegating wrapper around security.JwtService.
 * Unifies all JWT operations across the application into a single secure implementation.
 */
@Service("authJwtService")
public class JwtService {

    private final security.JwtService delegate;

    public JwtService(security.JwtService delegate) {
        this.delegate = delegate;
    }

    public String extractUsername(String token) {
        return delegate.extractUsername(token);
    }

    public Date exctractExpiration(String token) {
        return delegate.extractExpiration(token);
    }

    public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        return delegate.extractClaim(token, claimsResolver);
    }

    public String generateToken(User user) {
        return delegate.generateToken(user);
    }

    public String generateToken(Map<String, Object> extraClaims, UserDetails userDetails) {
        return delegate.generateToken(extraClaims, userDetails);
    }

    public boolean isTokenValid(String token, UserDetails userDetails) {
        return delegate.isTokenValid(token, userDetails);
    }

    public void blacklistToken(String token) {
        delegate.blacklistToken(token);
    }

    public boolean isTokenBlacklisted(String token) {
        return delegate.isTokenBlacklisted(token);
    }
}
