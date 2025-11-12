//ai 재료 추천

//유저가 식단에 들어갈 재료를 추천해주는 함수에 매개변수 타입
export interface GeminiGetFoodNameInput {
  //유저정보
  //음식 종류 (한식 양식 중식)
  userFoodCategories: string;
  //음식 종류 (고기 채소 해산물)
  userFoodTypes: string;
  //성별
  userGender: string;
  //나이
  userAge: string;

  //유저의 상태정보
  userStateName: string;
  userStateDescription: string;
  userStateInfo: string;

  //폼 정보
  //추가 요청사항
  additionalRequests: string;
  //식단 추천 범위
  dietRecommendationRange: "full_day" | "breakfast" | "lunch" | "dinner";
}

//식단에 들어갈 재료를 기반으로 랜덤으로 나온 메인 매뉴를 기반으로 식단을 추천해주는 함수의 매개변수 타입
export interface GeminiGetDietRecommendationInput {
  //유저정보
  //음식 종류 (한식 양식 중식)
  userFoodCategories: string;
  //음식 종류 (고기 채소 해산물)
  userFoodTypes: string;
  //성별
  userGender: string;
  //나이
  userAge: string;

  //유저의 상태정보
  userStateName: string;
  userStateDescription: string;
  userStateInfo: string;

  //폼 정보
  //추가 요청사항
  additionalRequests: string;
  //식단 추천 범위
  dietRecommendationRange: "full_day" | "breakfast" | "lunch" | "dinner";
  //식단에 들어갈 재료
  ingredientName: string;
}
