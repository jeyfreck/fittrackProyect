package repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import entity.Routine;

public interface RoutineRepository extends JpaRepository<Routine,Long> {
   
    List<Routine> findByUserId(Long userId);
}
