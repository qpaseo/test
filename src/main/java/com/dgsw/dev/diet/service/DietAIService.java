
package com.dgsw.dev.diet.service;

/**
 * AI 식단 추천 서비스 인터페이스
 */
public interface DietAIService {

    /**
     * AI를 통한 식단 추천
     *
     * @param stateId 상태 ID (다이어트, 벌크업 등)
     * @param request 사용자 요청사항
     * @param recommendedRange 추천 시간대 (morning, lunch, dinner, all)
     * @return AI가 생성한 식단 추천 내용
     * @throws com.dgsw.dev.diet.dto.exception.DietAIException AI 호출 실패 시
     */
    String getRecommendation(Long stateId, String request, String recommendedRange);
}