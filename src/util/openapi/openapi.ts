// 공공 데이터 요청 함수
import { NutritionApiResponse } from "../../types/open-api";

/*
흐름
1. 함수 호출 (+ Gemini API에서 받은 재료명)
2. serviceKey는 .env에서 가져옴
3. FOOD_NM_KR에 Gemini API에서 받은 재료명을 준비
4. numOfRows는 1로, pageNo는 1~80까지 랜덤, 데이터 없으면 /2해서 재시도 (최대 4번)
5. 최종적으로 매인 메뉴 이름 반환
*/

export const openApi_getFoodNtrCpntDbInq02 = async (
  foodName: string
): Promise<string> => {
  const serviceKey = import.meta.env.VITE_PUBLIC_API_KEY;
  const apiPath = "/1471000/FoodNtrCpntDbInfo02/getFoodNtrCpntDbInq02"; // ✅ 수정됨

  let attempts = 0;
  let pageNo = Math.floor(Math.random() * 80) + 1;

  while (attempts < 4) {
    try {
      // localhost 개발환경이면 Vite Proxy 사용
      const base = location.origin.includes("localhost:5173")
        ? `/openapi${apiPath}`
        : `https://apis.data.go.kr${apiPath}`;

      const requestUrl = `${base}?serviceKey=${encodeURIComponent(
        serviceKey
      )}&numOfRows=1&pageNo=${pageNo}&FOOD_NM_KR=${encodeURIComponent(
        foodName
      )}&type=json`; // ✅ 공식 스웨거 기준 type=json

      const res = await fetch(requestUrl);
      if (!res.ok) {
        const text = await res.text();
        throw new Error(`HTTP ${res.status}: ${text.slice(0, 200)}`);
      }

      const data: NutritionApiResponse = await res.json();
      const ingredientName = data?.body?.items?.[0]?.FOOD_NM_KR;

      if (ingredientName) return ingredientName;

      // 없으면 pageNo 절반으로 줄여서 재시도
      attempts++;
      pageNo = Math.max(1, Math.floor(pageNo / 2));
    } catch (error) {
      console.warn(`API 요청 실패 (${attempts + 1}번째):`, error);
      attempts++;
      pageNo = Math.max(1, Math.floor(pageNo / 2));
    }
  }

  // 실패하면 Gemini에서 받은 foodName 그대로 반환
  return foodName;
};
