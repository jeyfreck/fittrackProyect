package repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import entity.Progress;

public interface ProgressRepository extends JpaRepository<Progress, Long> {
   
    List<Progress> findByUserId(Long userId);
}
