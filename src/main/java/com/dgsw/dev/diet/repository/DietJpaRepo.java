package com.dgsw.dev.diet.repository;

import com.dgsw.dev.diet.domain.Dist;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface DietJpaRepo extends JpaRepository<Dist, Long> {

    /**
     * dietId로 식단 조회
     */
    Optional<Dist> findByDietId(Long dietId);

    /**
     * 모든 식단을 생성일 기준 오름차순으로 조회
     */
    List<Dist> findAllByOrderByCreatedAtAsc();

    /**
     * 모든 식단을 생성일 기준 내림차순으로 조회
     */
    List<Dist> findAllByOrderByCreatedAtDesc();

}