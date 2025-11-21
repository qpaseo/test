package com.dgsw.dev.diet.service;

import com.dgsw.dev.diet.domain.Dist;
import com.dgsw.dev.diet.domain.enums.SortOrder;
import com.dgsw.dev.diet.dto.exception.DietNotFoundException;
import com.dgsw.dev.diet.dto.exception.DietServerException;
import com.dgsw.dev.diet.dto.exception.InvalidDietRequestException;
import com.dgsw.dev.diet.dto.request.DietDetailRequest;
import com.dgsw.dev.diet.dto.request.DietListRequest;
import com.dgsw.dev.diet.dto.request.DietRecommendationRequest;
import com.dgsw.dev.diet.dto.response.DietDetailResponse;
import com.dgsw.dev.diet.dto.response.DietListItem;
import com.dgsw.dev.diet.dto.response.DietListResponse;
import com.dgsw.dev.diet.dto.response.DietRecommendationResponse;
import com.dgsw.dev.diet.repository.DietJpaRepo;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class DietService {

    private final DietJpaRepo dietJpaRepo;
    private final DietAIService dietAIService; // AI 서비스 (별도 작성 필요)

    private static final DateTimeFormatter DATE_FORMATTER = DateTimeFormatter.ofPattern("yyyy-MM-dd");

    /**
     * 메인화면 - 유저의 식단 조회
     */
    public DietListResponse getDietList(DietListRequest request) {
        try {
            // order 검증
            SortOrder sortOrder = validateAndParseSortOrder(request.getOrder());

            // 정렬에 따라 조회
            List<Dist> diets = sortOrder == SortOrder.ASC
                    ? dietJpaRepo.findAllByOrderByCreatedAtAsc()
                    : dietJpaRepo.findAllByOrderByCreatedAtDesc();

            // DTO 변환
            List<DietListItem> dietListItems = diets.stream()
                    .map(this::convertToDietListItem)
                    .collect(Collectors.toList());

            return DietListResponse.builder()
                    .diets(dietListItems)
                    .build();

        } catch (IllegalArgumentException e) {
            log.error("Invalid order parameter: {}", request.getOrder(), e);
            throw new InvalidDietRequestException("order가 정상적으로 입력되지 않았습니다");
        } catch (Exception e) {
            log.error("Failed to retrieve diet list", e);
            throw new DietServerException("서버 내부 오류로 인하여 메인상태 변경에 실패하였습니다.");
        }
    }

    /**
     * 메인화면 - 식단정보 상세조회
     */
    public DietDetailResponse getDietDetail(DietDetailRequest request) {
        try {
            // dietId 검증
            if (request.getDietId() == null) {
                throw new InvalidDietRequestException("id가 정상적으로 입력되지 않았습니다");
            }

            // 식단 조회
            Dist diet = dietJpaRepo.findByDietId(request.getDietId())
                    .orElseThrow(() -> new DietNotFoundException(request.getDietId()));

            // DTO 변환
            return convertToDietDetailResponse(diet);

        } catch (DietNotFoundException | InvalidDietRequestException e) {
            throw e;
        } catch (Exception e) {
            log.error("Failed to retrieve diet detail for dietId: {}", request.getDietId(), e);
            throw new DietServerException("서버 내부 오류로 인하여 에 실패하였습니다.");
        }
    }

    /**
     * 식단 추천 받기 - 식단 추천
     */
    @Transactional
    public DietRecommendationResponse createDietRecommendation(DietRecommendationRequest request) {
        try {
            // 요청값 검증
            validateDietRecommendationRequest(request);

            // AI 서비스 호출하여 식단 추천 받기
            String aiRecommendation = dietAIService.getRecommendation(
                    request.getStateId(),
                    request.getRequest(),
                    request.getRecommendedRange()
            );

            // 식단 엔티티 생성 및 저장
            Dist diet = Dist.builder()
                    .dietStateName(getStateNameById(request.getStateId()))
                    .request(request.getRequest())
                    .content(aiRecommendation)
                    .dietName(request.getRecommendedRange())
                    .build();

            dietJpaRepo.save(diet);

            return DietRecommendationResponse.builder()
                    .message(aiRecommendation)
                    .build();

        } catch (InvalidDietRequestException e) {
            throw e;
        } catch (Exception e) {
            log.error("Failed to create diet recommendation", e);

            // AI 서비스 관련 오류인지 확인
            if (e.getMessage() != null && e.getMessage().contains("AI")) {
                throw new DietServerException("ai 오류로 인하여 식단 추천에 실패하였습니다.");
            }

            throw new DietServerException("서버 내부 오류로 인하여 식단 추천에 실패하였습니다.");
        }
    }

    // === Private Helper Methods ===

    /**
     * SortOrder 검증 및 파싱
     */
    private SortOrder validateAndParseSortOrder(String order) {
        if (order == null || order.trim().isEmpty()) {
            return SortOrder.DESC; // 기본값: 내림차순
        }
        return SortOrder.fromCode(order);
    }

    /**
     * DietRecommendationRequest 검증
     */
    private void validateDietRecommendationRequest(DietRecommendationRequest request) {
        if (request.getStateId() == null) {
            throw new InvalidDietRequestException("생성에 필요한 값이 정상적으로 입력되지 않았습니다");
        }
        if (request.getRequest() == null || request.getRequest().trim().isEmpty()) {
            throw new InvalidDietRequestException("생성에 필요한 값이 정상적으로 입력되지 않았습니다");
        }
        if (request.getRecommendedRange() == null || request.getRecommendedRange().trim().isEmpty()) {
            throw new InvalidDietRequestException("생성에 필요한 값이 정상적으로 입력되지 않았습니다");
        }
    }

    /**
     * StateId로 StateName 조회 (임시 구현)
     * TODO: State 테이블이 별도로 있다면 조회 로직 수정 필요
     */
    private String getStateNameById(Long stateId) {
        // 임시로 하드코딩, 실제로는 State 테이블에서 조회해야 함
        switch (stateId.intValue()) {
            case 1:
                return "다이어트";
            case 2:
                return "벌크업";
            case 3:
                return "유지";
            default:
                return "일반";
        }
    }

    /**
     * Dist -> DietListItem 변환
     */
    private DietListItem convertToDietListItem(Dist diet) {
        return DietListItem.builder()
                .dietId(diet.getDietId())
                .createDate(diet.getCreatedAt().format(DATE_FORMATTER))
                .updatedDate(diet.getUpdatedAt().format(DATE_FORMATTER))
                .stateName(diet.getDietStateName())
                .request(diet.getRequest())
                .build();
    }

    /**
     * Dist -> DietDetailResponse 변환
     */
    private DietDetailResponse convertToDietDetailResponse(Dist diet) {
        return DietDetailResponse.builder()
                .createDate(diet.getCreatedAt().format(DATE_FORMATTER))
                .updatedDate(diet.getUpdatedAt().format(DATE_FORMATTER))
                .stateName(diet.getDietStateName())
                .request(diet.getRequest())
                .content(diet.getContent())
                .build();
    }
}