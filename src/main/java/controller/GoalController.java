
package controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import dto.GoalRequest;
import dto.GoalResponse;
import jakarta.servlet.http.HttpServletRequest;
import service.GoalService;






@RestController
@RequestMapping("/api/goals")
public class GoalController{
private final GoalService goalService;

public GoalController(GoalService goalService) {
    this.goalService = goalService;
}

@PostMapping
public ResponseEntity<GoalResponse> createGoal(@RequestBody GoalRequest request, HttpServletRequest httpRequest) {
    // Aquí puedes obtener el usuario desde el JWT token
    GoalResponse response = goalService.createGoal(request, httpRequest);
    return ResponseEntity.ok(response);
}

@GetMapping
public ResponseEntity<List<GoalResponse>> getGoals(HttpServletRequest httpRequest) {
    // Obtener metas del usuario autenticado
    List<GoalResponse> goals = goalService.getUserGoals(httpRequest);
    return ResponseEntity.ok(goals);
}
}