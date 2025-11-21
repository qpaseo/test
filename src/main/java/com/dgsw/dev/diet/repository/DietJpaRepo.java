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

    /**
     * 특정 상태(dietStateName)의 식단만 조회
     */
    List<Dist> findAllByDietStateNameOrderByCreatedAtDesc(String dietStateName);

    /**
     * 특정 기간 내의 식단 조회
     */
    @Query("SELECT d FROM Dist d WHERE d.createdAt BETWEEN :startDate AND :endDate ORDER BY d.createdAt DESC")
    List<Dist> findAllByDateRange(@Param("startDate") LocalDateTime startDate,
                                  @Param("endDate") LocalDateTime endDate);

    /**
     * 최근 N개의 식단 조회
     */
    List<Dist> findTop10ByOrderByCreatedAtDesc();

    /**
     * content가 null이 아닌 완료된 식단만 조회
     */
    List<Dist> findAllByContentIsNotNullOrderByCreatedAtDesc();

    /**
     * 특정 dietName의 식단 조회
     */
    List<Dist> findAllByDietNameOrderByCreatedAtDesc(String dietName);

    /**
     * dietId 존재 여부 확인
     */
    boolean existsByDietId(Long dietId);
}