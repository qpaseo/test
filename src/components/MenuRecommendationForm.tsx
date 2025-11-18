import { useState, useEffect } from "react";
import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
  doc,
  getDoc,
} from "firebase/firestore";
import { db } from "../lib/firebase";
import { useAuth } from "../contexts/AuthContext";
import { UserState } from "../types";
import { ArrowLeft, Sparkles } from "lucide-react";
import {
  gemini_getFoodName,
  gemini_getDietRecommendation_markdown,
} from "../util/gemini/gemini-dist";
import { openApi_getFoodNtrCpntDbInq02 } from "../util/openapi/openapi";
import {
  GeminiGetDietRecommendationInput,
  GeminiGetFoodNameInput,
} from "../types/gemini";
import { useTranslation } from "react-i18next";

interface MenuRecommendationFormProps {
  onBack: () => void;
  onSuccess: (result: string) => void;
}

export default function MenuRecommendationForm({
  onBack,
  onSuccess,
}: MenuRecommendationFormProps) {
  const { currentUser } = useAuth();
  const { t } = useTranslation();
  const [states, setStates] = useState<UserState[]>([]);
  const [mainState, setMainState] = useState<UserState | null>(null);
  const [formData, setFormData] = useState({
    stateId: "",
    additionalRequest: "",
    scope: "full_day" as "full_day" | "breakfast" | "lunch" | "dinner",
  });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadStates();
  }, [currentUser]);

  const loadStates = async () => {
    if (!currentUser) return;

    try {
      const q = query(
        collection(db, "user_states"),
        where("user_id", "==", currentUser.uid)
      );
      const querySnapshot = await getDocs(q);

      const loadedStates: UserState[] = [];
      let main: UserState | null = null;

      querySnapshot.forEach((doc) => {
        const data = doc.data() as UserState;
        const state = { ...data, user_state_id: doc.id };
        loadedStates.push(state);

        if (data.user_state_is_main) {
          main = state;
        }
      });

      setStates(loadedStates);
      if (main) {
        setMainState(main);
        setFormData((prev) => ({ ...prev, stateId: main.user_state_id }));
      }
    } catch (error) {
      console.error("상태 로드 실패:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser || !formData.stateId) return;

    setSubmitting(true);

    try {
      // 1) 상태 문서 조회
      const stateRef = doc(db, "user_states", formData.stateId);
      const stateSnap = await getDoc(stateRef);
      if (!stateSnap.exists()) {
        console.warn(
          t("menuRecommendationForm.stateNotFound"),
          formData.stateId
        );
        throw new Error(t("menuRecommendationForm.stateNotFound"));
      }
      const stateData = stateSnap.data() as any;
      const { user_state_description, user_state_info, user_state_name } =
        stateData;

      // 2) 사용자 프로필 조회
      const userSnap = await getDoc(doc(db, "users", currentUser.uid));
      if (!userSnap.exists()) {
        throw new Error(t("menuRecommendationForm.userProfileNotFound"));
      }
      const userData = userSnap.data() as any;
      const userFoodCategories =
        userData.user_food_categories ?? userData.food_categories ?? "";
      const userFoodTypes =
        userData.user_food_types ?? userData.food_types ?? "";
      const userGender = userData.user_gender ?? userData.gender ?? "";
      const userAge = userData.user_age ?? userData.age ?? "";

      // 3) Gemini로 재료명 추출
      const geminiFoodInput: GeminiGetFoodNameInput = {
        userFoodCategories,
        userFoodTypes,
        userGender,
        userAge,
        userStateName: user_state_name,
        userStateDescription: user_state_description,
        userStateInfo: user_state_info,
        additionalRequests: formData.additionalRequest,
        dietRecommendationRange: formData.scope,
      };

      const ingredientNameRaw = await gemini_getFoodName(geminiFoodInput);
      const ingredientName = ingredientNameRaw.trim();
      console.log("ingredientName", ingredientName);

      // 4) 공공 API로 재료 기반 메인 메뉴 조회
      const mainMenuName = await openApi_getFoodNtrCpntDbInq02(ingredientName);

      // 5) Gemini로 최종 마크다운 추천 생성
      const geminiDietInput: GeminiGetDietRecommendationInput = {
        userFoodCategories,
        userFoodTypes,
        userGender,
        userAge,
        userStateName: user_state_name,
        userStateDescription: user_state_description,
        userStateInfo: user_state_info,
        additionalRequests: formData.additionalRequest,
        dietRecommendationRange: formData.scope,
        ingredientName: mainMenuName,
      };
      const menuResult = await gemini_getDietRecommendation_markdown(
        geminiDietInput
      );

      // 6) 결과 저장: 'diet' 컬렉션에 스키마에 맞춰 저장
      const today = new Date();
      const yyyyMmDd = today.toISOString().slice(0, 10);
      const scopeKoMap: Record<string, string> = {
        full_day: t("menuRecommendationForm.scopeOptions.fullDay"),
        breakfast: t("menuRecommendationForm.scopeOptions.breakfast"),
        lunch: t("menuRecommendationForm.scopeOptions.lunch"),
        dinner: t("menuRecommendationForm.scopeOptions.dinner"),
      };
      const scopeKo = scopeKoMap[formData.scope] ?? formData.scope;
      const dietName = `${yyyyMmDd} - ${user_state_name} - ${scopeKo}`;

      await addDoc(collection(db, "diet"), {
        user_id: currentUser.uid,
        diet_content: menuResult,
        diet_name: dietName,
        diet_create_date: today.toISOString(),
        created_date: today.toISOString(),
      });

      onSuccess(menuResult);
    } catch (error) {
      console.error(t("menuRecommendationForm.recommendationFailed"), error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-orange-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div>
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-6 transition"
      >
        <ArrowLeft className="w-5 h-5" />
        <span className="font-medium">{t("menuRecommendationForm.back")}</span>
      </button>

      <div className="bg-white rounded-2xl shadow-lg p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-orange-500 p-3 rounded-full">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800">
            {t("menuRecommendationForm.title")}
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="stateId"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              {t("menuRecommendationForm.stateLabel")}
            </label>
            <select
              id="stateId"
              name="stateId"
              value={formData.stateId}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition"
              required
            >
              <option value="">
                {t("menuRecommendationForm.statePlaceholder")}
              </option>
              {states.map((state) => (
                <option key={state.user_state_id} value={state.user_state_id}>
                  {state.user_state_name}
                  {state.user_state_is_main
                    ? t("menuRecommendationForm.stateMainSuffix")
                    : ""}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="additionalRequest"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              {t("menuRecommendationForm.additionalRequestLabel")}
            </label>
            <textarea
              id="additionalRequest"
              name="additionalRequest"
              value={formData.additionalRequest}
              onChange={handleChange}
              rows={3}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition resize-none"
              placeholder={t(
                "menuRecommendationForm.additionalRequestPlaceholder"
              )}
            />
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <label className="block text-sm font-medium text-gray-700 mb-4">
              {t("menuRecommendationForm.scopeLabel")}
            </label>

            <div className="grid grid-cols-2 gap-3">
              {[
                {
                  value: "breakfast",
                  label: t("menuRecommendationForm.scopeOptions.breakfast"),
                },
                {
                  value: "lunch",
                  label: t("menuRecommendationForm.scopeOptions.lunch"),
                },
                {
                  value: "dinner",
                  label: t("menuRecommendationForm.scopeOptions.dinner"),
                },
                {
                  value: "full_day",
                  label: t("menuRecommendationForm.scopeOptions.fullDay"),
                },
              ].map((opt) => (
                <label key={opt.value} className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="scope"
                    value={opt.value}
                    checked={formData.scope === opt.value}
                    onChange={handleChange}
                    className="w-4 h-4 text-gray-600 border-gray-300 focus:ring-0 focus:outline-none"
                  />
                  <span className="text-sm font-medium text-gray-700">
                    {opt.label}
                  </span>
                </label>
              ))}
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={onBack}
              className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-3 rounded-lg transition"
            >
              {t("menuRecommendationForm.cancelButton")}
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <Sparkles className="w-5 h-5" />
              {submitting
                ? t("menuRecommendationForm.submitting")
                : t("menuRecommendationForm.submitButton")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
