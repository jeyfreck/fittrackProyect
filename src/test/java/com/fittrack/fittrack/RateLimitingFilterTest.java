package com.fittrack.fittrack;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.mock.web.MockFilterChain;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.mock.web.MockHttpServletResponse;
import org.springframework.test.util.ReflectionTestUtils;
import security.RateLimitingFilter;

import java.io.IOException;

import static org.junit.jupiter.api.Assertions.assertEquals;

class RateLimitingFilterTest {

    private RateLimitingFilter filter;

    @BeforeEach
    void setUp() {
        filter = new RateLimitingFilter();
        // Set maximum requests per minute to 3 for testing
        ReflectionTestUtils.setField(filter, "maxRequestsPerMinute", 3);
    }

    @Test
    @DisplayName("Should permit requests under threshold and block on limit exceeded")
    void testRateLimitEnforcement() throws ServletException, IOException {
        String clientIp = "192.168.1.100";

        // First 3 requests should pass with HTTP 200
        for (int i = 1; i <= 3; i++) {
            MockHttpServletRequest request = new MockHttpServletRequest("POST", "/api/auth/login");
            request.setRemoteAddr(clientIp);
            MockHttpServletResponse response = new MockHttpServletResponse();
            FilterChain chain = new MockFilterChain();

            filter.doFilter(request, response, chain);
            assertEquals(200, response.getStatus(), "Request " + i + " should succeed");
        }

        // 4th request must be blocked with HTTP 429 Too Many Requests
        MockHttpServletRequest blockedRequest = new MockHttpServletRequest("POST", "/api/auth/login");
        blockedRequest.setRemoteAddr(clientIp);
        MockHttpServletResponse blockedResponse = new MockHttpServletResponse();
        FilterChain chain = new MockFilterChain();

        filter.doFilter(blockedRequest, blockedResponse, chain);
        assertEquals(429, blockedResponse.getStatus(), "Exceeded request should return HTTP 429");
        assertEquals("60", blockedResponse.getHeader("Retry-After"));
    }
}
