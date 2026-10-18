package controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import dto.ProgressRequest;
import dto.ProgressResponse;
import jakarta.servlet.http.HttpServletRequest;
import service.ProgressService;

@RestController
@RequestMapping("/api/progress")
public class ProgressController {

    private final ProgressService progressService;

    public ProgressController(ProgressService progressService) {
        this.progressService = progressService;
    }

    @PostMapping
    public ResponseEntity<ProgressResponse> recordProgress(@RequestBody ProgressRequest request, HttpServletRequest httpRequest) {
        ProgressResponse response = progressService.recordProgress(request, httpRequest);
        return ResponseEntity.ok(response);
    }

    @GetMapping
    public ResponseEntity<List<ProgressResponse>> getProgress(HttpServletRequest httpRequest) {
        List<ProgressResponse> progressList = progressService.getUserProgress(httpRequest);
        return ResponseEntity.ok(progressList);
    }
}
