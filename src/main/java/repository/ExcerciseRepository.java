package repository;

import org.springframework.data.jpa.repository.JpaRepository;

import entity.Excercise;

public interface ExcerciseRepository extends JpaRepository<Excercise,Long> {
    
}
