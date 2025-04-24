package entity;

import java.time.LocalDate;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "meals")
public class Meal {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

     private String name;
     private Integer calories;
     private Double proteins;
     private Double fats;
     private Double carbohydrates;
     private LocalDate date;

     @ManyToOne
     @JoinColumn(name = "user_id")
     private User user;

     public Meal(){}

     public Meal(String name, Integer calories, Double proteins, Double fats, Double carbohydrates, LocalDate date, User user){
            this.name = name;
            this.calories = calories;
            this.proteins = proteins;
            this.fats = fats;
            this.carbohydrates = carbohydrates;
            this.date = date;
            this.user = user;
     }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Integer getCalories() {
        return calories;
    }

    public void setCalories(Integer calories) {
        this.calories = calories;
    }

    public Double getProteins() {
        return proteins;
    }

    public void setProteins(Double proteins) {
        this.proteins = proteins;
    }

    public Double getFats() {
        return fats;
    }

    public void setFats(Double fats) {
        this.fats = fats;
    }

    public Double getCarbohydrates() {
        return carbohydrates;
    }

    public void setCarbohydrates(Double carbohydrates) {
        this.carbohydrates = carbohydrates;
    }

    public LocalDate getDate() {
        return date;
    }

    public void setDate(LocalDate date) {
        this.date = date;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }


     

}
