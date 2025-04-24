package entity;

import java.time.LocalDate;
import java.util.List;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "routines")
public class Routine {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    private LocalDate date;

    private User user;

    @ManyToOne
    @JoinTable(name = "routine_exercise", joinColumns = @JoinColumn(name = "routine_id" ),
            inverseJoinColumns = @JoinColumn(name = "exercise_id"))
            private List<Excercise> exercises;

    public Routine(){}

    public Routine(String name, LocalDate date, User user, List<Excercise> excercises){
        this.name = name;
        this.date = date;
        this.user = user;
        this.exercises = excercises;
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

    public List<Excercise> getExercises() {
        return exercises;
    }

    public void setExercises(List<Excercise> exercises) {
        this.exercises = exercises;
    }


}
