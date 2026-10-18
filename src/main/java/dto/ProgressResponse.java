package dto;

import java.time.LocalDate;

public class ProgressResponse {
    private Long id;
    private LocalDate date;
    private Double weight;
    private Double waist;
    private Double bmi;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public LocalDate getDate() {
        return date;
    }

    public void setDate(LocalDate date) {
        this.date = date;
    }

    public Double getWeight() {
        return weight;
    }

    public void setWeight(Double weight) {
        this.weight = weight;
    }

    public Double getWaist() {
        return waist;
    }

    public void setWaist(Double waist) {
        this.waist = waist;
    }

    public Double getBmi() {
        return bmi;
    }

    public void setBmi(Double bmi) {
        this.bmi = bmi;
    }
}
