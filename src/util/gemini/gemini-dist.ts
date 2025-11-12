import { GoogleGenerativeAI } from "@google/generative-ai";
import {
  GeminiGetDietRecommendationInput,
  GeminiGetFoodNameInput,
} from "../../types/gemini";

//gemini api를 사용하여 사용자가 선택한 상태와 요청에 따라 식단에 들어갈 재료를 추천하는 함수 (이후 openApi_getFoodNtrCpntDbInq02 호출)
export async function gemini_getFoodName(
  geminiGetFoodNameInput: GeminiGetFoodNameInput
) {
  console.log("geminiGetFoodNameInput", geminiGetFoodNameInput);
  const apiKey = import.meta.env.VITE_GOOGLE_GEMINI_API_KEY as string;
  const geminiModel = import.meta.env.VITE_GEMINI_MODEL as string;
  if (!apiKey)
    throw new Error("Missing VITE_GOOGLE_GEMINI_API_KEY env variable");
  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: geminiModel });
  const prompt = `
You are a nutrition and culinary AI assistant helping to generate a single key ingredient for a personalized meal recommendation.

Use the following information about the user to determine one suitable core ingredient that best fits the user's meal plan.

[User Information]
- Preferred cuisine category: ${geminiGetFoodNameInput.userFoodCategories}
- Preferred food type: ${geminiGetFoodNameInput.userFoodTypes}
- Gender: ${geminiGetFoodNameInput.userGender}
- Age: ${geminiGetFoodNameInput.userAge}

[User Situation]
- Situation name: ${geminiGetFoodNameInput.userStateName}
- Situation description: ${geminiGetFoodNameInput.userStateDescription}
- Additional situation info: ${geminiGetFoodNameInput.userStateInfo}

[Form Information]
- Additional requests: ${geminiGetFoodNameInput.additionalRequests}
- Diet recommendation range: ${geminiGetFoodNameInput.dietRecommendationRange}

Your task:
1. Recommend **only one core ingredient** that best matches the user's situation and preferences.
2. The ingredient should be realistic and typically used in meals fitting the provided context.
3. Output format **must be strictly in Korean**, containing only the ingredient name (no brackets, no extra words).
4. Do not include any explanations, punctuation, or numbering — **return only the ingredient name**.
`;

  console.log(prompt);
  // 응답 생성
  const result = await model.generateContent(prompt);
  console.log("1차 ai 반환 값", result.response.text());
  const response = await result.response;
  return response.text();
}

//gemini api를 사용하여 식단에 들어가는 메인 메뉴를 기반으로 식단을 추천해주는 함수
export async function gemini_getDietRecommendation_markdown(
  geminiGetDietRecommendationInput: GeminiGetDietRecommendationInput
): Promise<string> {
  console.log(
    "geminiGetDietRecommendationInput",
    geminiGetDietRecommendationInput
  );
  const apiKey = import.meta.env.VITE_GOOGLE_GEMINI_API_KEY as string;
  const geminiModel = import.meta.env.VITE_GEMINI_MODEL as string;
  if (!apiKey)
    throw new Error("Missing VITE_GOOGLE_GEMINI_API_KEY env variable");
  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: geminiModel });
  const prompt = `
You are a professional nutritionist and AI chef assistant. 
Based on the provided user information and the main ingredient, create a realistic and appealing meal recommendation in Korean.

Use the information below to generate a **Korean markdown-style meal suggestion** that includes:
1. The name of the recommended main dish (메뉴 이름 정리)
2. The reason for the recommendation (매뉴를 추천한 이유)
3. Other related meal suggestions or alternatives (다른 음식 추천)

[User Information]
- Preferred cuisine category: ${geminiGetDietRecommendationInput.userFoodCategories}
- Preferred food type: ${geminiGetDietRecommendationInput.userFoodTypes}
- Gender: ${geminiGetDietRecommendationInput.userGender}
- Age: ${geminiGetDietRecommendationInput.userAge}

[User Situation]
- Situation name: ${geminiGetDietRecommendationInput.userStateName}
- Situation description: ${geminiGetDietRecommendationInput.userStateDescription}
- Additional situation info: ${geminiGetDietRecommendationInput.userStateInfo}

[Form Information]
- Additional requests: ${geminiGetDietRecommendationInput.additionalRequests}
- Diet recommendation range: ${geminiGetDietRecommendationInput.dietRecommendationRange}

[Main Ingredient]
- ${geminiGetDietRecommendationInput.ingredientName}

Your output must:
- Be written **in Korean**
- Use **Markdown formatting**
- Follow this exact structure:

# 🍽️ 메뉴 이름 정리
(여기에 추천하는 식단의 매뉴 이름들을 정리)

## 💡 매뉴를 추천한 이유
(해당 메뉴를 추천한 이유를 자연스럽게 설명)

## 🥗 다른 음식 추천
(예: “~을 먹으시니 ~도 좋아하실 것 같아요. 최근에는 ~가 인기로 알고 있는데 ~는 어떠신가요?” 형식으로 2~3줄 작성)

Guidelines:
- The recommendation must match the user's preferences, situation, and dietary range.
- The menu name must be a real dish commonly eaten in Korea.
- Avoid lists or numbering. Keep tone friendly, informative, and natural.
`;

  // 응답 생성
  const result = await model.generateContent(prompt);
  const response = await result.response;
  return response.text();
}
