package repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import entity.Meal;

public interface MealRepository extends JpaRepository<Meal, Long>{
    
    List<Meal> findByUserId(Long userId);
}
