package auth;

import dto.AuthResponse;
import dto.LoginRequest;
import dto.RegisterRequest;
import entity.User;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import repository.UserRepository;
import security.JwtService;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder,
                       JwtService jwtService, AuthenticationManager authenticationManager) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.authenticationManager = authenticationManager;
    }

    public AuthResponse register(RegisterRequest request) {
        if (request.getEmail() == null || request.getEmail().isBlank()) {
            throw new IllegalArgumentException("El correo electrónico es requerido.");
        }
        if (request.getPassword() == null || request.getPassword().length() < 6) {
            throw new IllegalArgumentException("La contraseña debe tener al menos 6 caracteres.");
        }
        if (userRepository.findByEmail(request.getEmail().trim().toLowerCase()).isPresent()) {
            throw new IllegalArgumentException("Ya existe una cuenta con el correo especificado.");
        }

        User user = new User();
        user.setName(request.getName() != null ? request.getName().trim() : "Atleta");
        user.setEmail(request.getEmail().trim().toLowerCase());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole("USER");

        userRepository.save(user);

        String token = jwtService.generateToken(user);
        return new AuthResponse(token);
    }

    public AuthResponse login(LoginRequest request) {
        if (request.getEmail() == null || request.getPassword() == null) {
            throw new IllegalArgumentException("Debe ingresar correo y contraseña.");
        }

        String normalizedEmail = request.getEmail().trim().toLowerCase();

        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(normalizedEmail, request.getPassword())
            );
        } catch (BadCredentialsException e) {
            throw new BadCredentialsException("Credenciales incorrectas. Verifique su correo y contraseña.");
        }

        User user = userRepository.findByEmail(normalizedEmail)
                .orElseThrow(() -> new BadCredentialsException("Usuario no encontrado"));

        String token = jwtService.generateToken(user);
        return new AuthResponse(token);
    }

    public void logout(String authHeader) {
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7);
            jwtService.blacklistToken(token);
        }
    }
}
