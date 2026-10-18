package config;

import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.MalformedJwtException;
import io.jsonwebtoken.security.SignatureException;
import jakarta.servlet.http.HttpServletRequest;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.AuthenticationException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.Instant;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.Map;

/**
 * Enterprise Security & API Exception Handler.
 * Prevents Stack Trace / Internal Information Leakage (CWE-209) and standardizes API error payloads.
 */
@RestControllerAdvice
public class GlobalSecurityExceptionHandler {

    private static final Logger log = LoggerFactory.getLogger(GlobalSecurityExceptionHandler.class);

    @ExceptionHandler(BadCredentialsException.class)
    public ResponseEntity<Map<String, Object>> handleBadCredentials(BadCredentialsException ex, HttpServletRequest request) {
        log.warn("Authentication failed for path {}: {}", request.getRequestURI(), ex.getMessage());
        return buildErrorResponse(HttpStatus.UNAUTHORIZED, "Credenciales incorrectas o cuenta no encontrada.", request.getRequestURI(), null);
    }

    @ExceptionHandler(AuthenticationException.class)
    public ResponseEntity<Map<String, Object>> handleAuthenticationException(AuthenticationException ex, HttpServletRequest request) {
        log.warn("Auth exception on {}: {}", request.getRequestURI(), ex.getMessage());
        return buildErrorResponse(HttpStatus.UNAUTHORIZED, "No autenticado: " + ex.getMessage(), request.getRequestURI(), null);
    }

    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<Map<String, Object>> handleAccessDenied(AccessDeniedException ex, HttpServletRequest request) {
        log.warn("Access denied on {}: {}", request.getRequestURI(), ex.getMessage());
        return buildErrorResponse(HttpStatus.FORBIDDEN, "Acceso denegado: Privilegios insuficientes para esta operación.", request.getRequestURI(), null);
    }

    @ExceptionHandler({SignatureException.class, MalformedJwtException.class, ExpiredJwtException.class})
    public ResponseEntity<Map<String, Object>> handleJwtSecurityExceptions(Exception ex, HttpServletRequest request) {
        log.warn("JWT Security violation on {}: {}", request.getRequestURI(), ex.getMessage());
        return buildErrorResponse(HttpStatus.UNAUTHORIZED, "Token de sesión inválido, expirado o manipulado.", request.getRequestURI(), null);
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<Map<String, Object>> handleIllegalArgument(IllegalArgumentException ex, HttpServletRequest request) {
        return buildErrorResponse(HttpStatus.BAD_REQUEST, ex.getMessage(), request.getRequestURI(), null);
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, Object>> handleValidationExceptions(MethodArgumentNotValidException ex, HttpServletRequest request) {
        Map<String, String> fieldErrors = new HashMap<>();
        for (FieldError error : ex.getBindingResult().getFieldErrors()) {
            fieldErrors.put(error.getField(), error.getDefaultMessage());
        }
        return buildErrorResponse(HttpStatus.BAD_REQUEST, "Error de validación en los datos enviados.", request.getRequestURI(), fieldErrors);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<Map<String, Object>> handleAllUncaughtExceptions(Exception ex, HttpServletRequest request) {
        // Log full internal exception details securely on the server console/logs
        log.error("Unhandled internal exception on path: " + request.getRequestURI(), ex);

        // Return sanitized message to client to prevent internal fingerprinting
        return buildErrorResponse(
                HttpStatus.INTERNAL_SERVER_ERROR,
                "Se produjo un error interno en el servidor. Por favor intente más tarde.",
                request.getRequestURI(),
                null
        );
    }

    private ResponseEntity<Map<String, Object>> buildErrorResponse(
            HttpStatus status, String message, String path, Map<String, ?> details) {
        Map<String, Object> body = new LinkedHashMap<>();
        body.put("timestamp", Instant.now().toString());
        body.put("status", status.value());
        body.put("error", status.getReasonPhrase());
        body.put("message", message);
        body.put("path", path);
        if (details != null && !details.isEmpty()) {
            body.put("details", details);
        }
        return new ResponseEntity<>(body, status);
    }
}
