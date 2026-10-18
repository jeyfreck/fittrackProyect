package auth;

import dto.AuthResponse;
import dto.LoginRequest;
import dto.RegisterRequest;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@RequestBody RegisterRequest request) {
        return ResponseEntity.ok(authService.register(request));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody LoginRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }

    @PostMapping("/logout")
    public ResponseEntity<Map<String, String>> logout(
            @RequestHeader(value = HttpHeaders.AUTHORIZATION, required = false) String authHeader) {
        authService.logout(authHeader);
        return ResponseEntity.ok(Map.of(
                "message", "Sesión cerrada exitosamente. Token revocado en el servidor."
        ));
    }
}
