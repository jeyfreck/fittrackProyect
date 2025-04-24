package dto;

import java.time.LocalDate;

import entity.GoalType;

public class GoalResponse {
    private Long id;
     private String title;
    private String description;
    private LocalDate startDate;
    private LocalDate endDate;
    private GoalType type;
    private Double targetValue;

    public String getTitle() {
        return title;
    }
    public void setTitle(String title) {
        this.title = title;
    }
    public String getDescription() {
        return description;
    }
    public void setDescription(String description) {
        this.description = description;
    }
    public LocalDate getStartDate() {
        return startDate;
    }
    public void setStartDate(LocalDate startDate) {
        this.startDate = startDate;
    }
    public LocalDate getEndDate() {
        return endDate;
    }
    public void setEndDate(LocalDate endDate) {
        this.endDate = endDate;
    }
    public GoalType getType() {
        return type;
    }
    public void setType(GoalType type) {
        this.type = type;
    }
    public Double getTargetValue() {
        return targetValue;
    }
    public void setTargetValue(Double targetValue) {
        this.targetValue = targetValue;
    }
    public Long getId() {
        return id;
    }
    public void setId(Long id) {
        this.id = id;
    }
    
    
}
