package service;

import dto.ProgressRequest;
import dto.ProgressResponse;
import entity.Progress;
import entity.User;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.stereotype.Service;
import repository.ProgressRepository;
import repository.UserRepository;
import security.JwtService;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ProgressService {

    private final ProgressRepository progressRepository;
    private final UserRepository userRepository;
    private final JwtService jwtService;

    public ProgressService(ProgressRepository progressRepository, UserRepository userRepository, JwtService jwtService) {
        this.progressRepository = progressRepository;
        this.userRepository = userRepository;
        this.jwtService = jwtService;
    }

    public ProgressResponse recordProgress(ProgressRequest request, HttpServletRequest httpRequest) {
        User user = getUserFromRequest(httpRequest);

        Progress progress = new Progress();
        progress.setDate(request.getDate() != null ? request.getDate() : LocalDate.now());
        progress.setWeight(request.getWeight());
        progress.setWaist(request.getWaist());
        progress.setUser(user);

        // Calculate BMI automatically if user height is present
        if (user.getHeight() != null && user.getHeight() > 0 && request.getWeight() != null) {
            double heightMeters = user.getHeight() / 100.0;
            double bmi = request.getWeight() / (heightMeters * heightMeters);
            progress.setBmi(Math.round(bmi * 10.0) / 10.0);

            // Also update current weight on user profile
            user.setWeight(request.getWeight());
            userRepository.save(user);
        }

        progress = progressRepository.save(progress);
        return mapToResponse(progress);
    }

    public List<ProgressResponse> getUserProgress(HttpServletRequest httpRequest) {
        User user = getUserFromRequest(httpRequest);
        return progressRepository.findByUserId(user.getId()).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    private User getUserFromRequest(HttpServletRequest request) {
        String authHeader = request.getHeader("Authorization");
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7);
            String email = jwtService.extractUsername(token);
            return userRepository.findByEmail(email)
                    .orElseThrow(() -> new BadCredentialsException("Usuario no encontrado"));
        }
        throw new BadCredentialsException("Token de autorización no encontrado o inválido");
    }

    private ProgressResponse mapToResponse(Progress progress) {
        ProgressResponse response = new ProgressResponse();
        response.setId(progress.getId());
        response.setDate(progress.getDate());
        response.setWeight(progress.getWeight());
        response.setWaist(progress.getWaist());
        response.setBmi(progress.getBmi());
        return response;
    }
}
