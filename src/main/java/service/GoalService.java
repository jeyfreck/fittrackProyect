package service;

import dto.GoalRequest;
import dto.GoalResponse;
import entity.Goal;
import entity.User;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.stereotype.Service;
import repository.GoalRepository;
import repository.UserRepository;
import security.JwtService;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class GoalService {

    private final GoalRepository goalRepository;
    private final UserRepository userRepository;
    private final JwtService jwtService;

    public GoalService(GoalRepository goalRepository, UserRepository userRepository, JwtService jwtService) {
        this.goalRepository = goalRepository;
        this.userRepository = userRepository;
        this.jwtService = jwtService;
    }

    public GoalResponse createGoal(GoalRequest request, HttpServletRequest httpRequest) {
        String token = extractToken(httpRequest);
        String userEmail = jwtService.extractUsername(token);
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new BadCredentialsException("Usuario no encontrado"));

        Goal goal = new Goal();
        goal.setTitle(request.getTitle());
        goal.setDescription(request.getDescription());
        goal.setStartDate(request.getStartDate());
        goal.setEndDate(request.getEndDate());
        goal.setType(request.getType());
        goal.setTargetValue(request.getTargetValue());
        goal.setUser(user);

        goal = goalRepository.save(goal);
        return mapToResponse(goal);
    }

    public List<GoalResponse> getUserGoals(HttpServletRequest httpRequest) {
        String token = extractToken(httpRequest);
        String userEmail = jwtService.extractUsername(token);
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new BadCredentialsException("Usuario no encontrado"));

        return goalRepository.findByUser(user).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    private GoalResponse mapToResponse(Goal goal) {
        GoalResponse response = new GoalResponse();
        response.setId(goal.getId());
        response.setTitle(goal.getTitle());
        response.setDescription(goal.getDescription());
        response.setStartDate(goal.getStartDate());
        response.setEndDate(goal.getEndDate());
        response.setType(goal.getType());
        response.setTargetValue(goal.getTargetValue());
        return response;
    }

    private String extractToken(HttpServletRequest request) {
        String header = request.getHeader("Authorization");
        if (header != null && header.startsWith("Bearer ")) {
            return header.substring(7);
        }
        throw new BadCredentialsException("Token de autorización no encontrado o inválido");
    }
}
