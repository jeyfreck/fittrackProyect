package service;

import dto.MealRequest;
import dto.MealResponse;
import entity.Meal;
import entity.User;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.stereotype.Service;
import repository.MealRepository;
import repository.UserRepository;
import security.JwtService;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class MealService {

    private final MealRepository mealRepository;
    private final UserRepository userRepository;
    private final JwtService jwtService;

    public MealService(MealRepository mealRepository, UserRepository userRepository, JwtService jwtService) {
        this.mealRepository = mealRepository;
        this.userRepository = userRepository;
        this.jwtService = jwtService;
    }

    public MealResponse createMeal(MealRequest request, HttpServletRequest httpRequest) {
        User user = getUserFromRequest(httpRequest);

        Meal meal = new Meal();
        meal.setName(request.getName());
        meal.setCalories(request.getCalories());
        meal.setProteins(request.getProteins());
        meal.setFats(request.getFats());
        meal.setCarbohydrates(request.getCarbohydrates());
        meal.setDate(request.getDate() != null ? request.getDate() : LocalDate.now());
        meal.setUser(user);

        meal = mealRepository.save(meal);
        return mapToResponse(meal);
    }

    public List<MealResponse> getUserMeals(HttpServletRequest httpRequest) {
        User user = getUserFromRequest(httpRequest);
        return mealRepository.findByUserId(user.getId()).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public void deleteMeal(Long id, HttpServletRequest httpRequest) {
        User user = getUserFromRequest(httpRequest);
        Meal meal = mealRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Comida no encontrada"));
        
        // IDOR Protection: Verify ownership
        if (!meal.getUser().getId().equals(user.getId())) {
            throw new AccessDeniedException("No está autorizado para eliminar esta comida.");
        }
        mealRepository.delete(meal);
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

    private MealResponse mapToResponse(Meal meal) {
        MealResponse response = new MealResponse();
        response.setId(meal.getId());
        response.setName(meal.getName());
        response.setCalories(meal.getCalories());
        response.setProteins(meal.getProteins());
        response.setFats(meal.getFats());
        response.setCarbohydrates(meal.getCarbohydrates());
        response.setDate(meal.getDate());
        return response;
    }
}
