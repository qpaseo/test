package com.dgsw.dev.diet.service;

import com.dgsw.dev.diet.dto.request.DietDetailRequest;
import com.dgsw.dev.diet.dto.request.DietListRequest;
import com.dgsw.dev.diet.dto.request.DietRecommendationRequest;
import com.dgsw.dev.diet.dto.response.DietDetailResponse;
import com.dgsw.dev.diet.dto.response.DietListResponse;
import com.dgsw.dev.diet.dto.response.DietRecommendationResponse;

public interface DietService {

    DietListResponse getDietList(DietListRequest request);

    DietDetailResponse getDietDetail(DietDetailRequest request);

    DietRecommendationResponse createDietRecommendation(DietRecommendationRequest request);
}