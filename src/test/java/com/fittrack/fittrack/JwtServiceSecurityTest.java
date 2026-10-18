package com.fittrack.fittrack;

import entity.User;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.test.util.ReflectionTestUtils;
import security.JwtService;

import static org.junit.jupiter.api.Assertions.*;

class JwtServiceSecurityTest {

    private JwtService jwtService;
    private User testUser;

    @BeforeEach
    void setUp() {
        jwtService = new JwtService();
        // 256-bit high-entropy secret key
        ReflectionTestUtils.setField(jwtService, "secretKey", "c3VwZXItc2VjdXJlLWZpdHRyYWNrLTNkLWN5YmVybmV0aWMtcHJvamVjdC1rZXktMjAyNi0yNTYtYml0cw==");
        ReflectionTestUtils.setField(jwtService, "jwtExpiration", 3600000L);
        ReflectionTestUtils.setField(jwtService, "refreshExpiration", 604800000L);

        testUser = new User();
        testUser.setId(1L);
        testUser.setEmail("cyber.athlete@fittrack.ai");
        testUser.setName("Cyber Athlete");
        testUser.setRole("USER");
    }

    @Test
    @DisplayName("JWT Generation and Claims Extraction Verification")
    void testTokenGenerationAndExtraction() {
        String token = jwtService.generateToken(testUser);
        assertNotNull(token);
        assertFalse(token.isEmpty());

        String username = jwtService.extractUsername(token);
        assertEquals("cyber.athlete@fittrack.ai", username);
        assertTrue(jwtService.isTokenValid(token, testUser));
    }

    @Test
    @DisplayName("Token Revocation / Server-Side Blacklisting Test")
    void testTokenBlacklistingOnLogout() {
        String token = jwtService.generateToken(testUser);
        assertTrue(jwtService.isTokenValid(token, testUser));
        assertFalse(jwtService.isTokenBlacklisted(token));

        // Perform server-side revocation (Logout)
        jwtService.blacklistToken(token);

        assertTrue(jwtService.isTokenBlacklisted(token), "Token should be registered as blacklisted");
        assertFalse(jwtService.isTokenValid(token, testUser), "Revoked token must be rejected as invalid");
    }

    @Test
    @DisplayName("Tampered Signature Detection Test")
    void testTamperedTokenRejection() {
        String token = jwtService.generateToken(testUser);
        // Tamper with the token string
        String tamperedToken = token.substring(0, token.length() - 4) + "XXXX";

        assertFalse(jwtService.isTokenValid(tamperedToken, testUser));
    }
}
