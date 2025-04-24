package repository;

import org.springframework.data.jpa.repository.JpaRepository;

import entity.Goal;
import entity.User;

import java.util.List;


public interface GoalRepository extends JpaRepository<Goal, Long> {
    
    List<Goal> findByUser(User user);
}
