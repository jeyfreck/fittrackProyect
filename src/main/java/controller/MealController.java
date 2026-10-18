package controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import dto.MealRequest;
import dto.MealResponse;
import jakarta.servlet.http.HttpServletRequest;
import service.MealService;

@RestController
@RequestMapping("/api/meals")
public class MealController {

    private final MealService mealService;

    public MealController(MealService mealService) {
        this.mealService = mealService;
    }

    @PostMapping
    public ResponseEntity<MealResponse> createMeal(@RequestBody MealRequest request, HttpServletRequest httpRequest) {
        MealResponse response = mealService.createMeal(request, httpRequest);
        return ResponseEntity.ok(response);
    }

    @GetMapping
    public ResponseEntity<List<MealResponse>> getMeals(HttpServletRequest httpRequest) {
        List<MealResponse> meals = mealService.getUserMeals(httpRequest);
        return ResponseEntity.ok(meals);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteMeal(@PathVariable Long id, HttpServletRequest httpRequest) {
        mealService.deleteMeal(id, httpRequest);
        return ResponseEntity.noContent().build();
    }
}
