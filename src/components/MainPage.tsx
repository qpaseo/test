import { useEffect, useState } from "react";
import { Sparkles, Clock } from "lucide-react";
import { collection, query, where, getDocs, limit } from "firebase/firestore";
import { db } from "../lib/firebase";
import { useAuth } from "../contexts/AuthContext";
import MenuRecommendationForm from "./MenuRecommendationForm";
import MenuRecommendationResult from "./MenuRecommendationResult";
import ReactMarkdown from "react-markdown";
import { useTranslation } from "react-i18next";
import { Diet } from "../types/entity";

type MainPageState = "view" | "form" | "result" | "detail";

export default function MainPage() {
  const { currentUser } = useAuth();
  const [pageState, setPageState] = useState<MainPageState>("view");
  const [recommendations, setRecommendations] = useState<Diet[]>([]);
  const [resultData, setResultData] = useState<string>("");
  const [selectedRec, setSelectedRec] = useState<Diet | null>(null);
  const [loading, setLoading] = useState(true);
  const { t, i18n } = useTranslation();
  useEffect(() => {
    console.log("=== 번역 디버깅 ===");
    console.log("현재 언어:", i18n.language);
    console.log("사용 가능한 언어들:", i18n.languages);

    // 번역 리소스 확인
    console.log("EN resources:", i18n.getResourceBundle("en", "translation"));
    console.log("KO resources:", i18n.getResourceBundle("ko", "translation"));

    // 특정 키 확인
    console.log(
      "mainPage.title (en):",
      i18n.t("mainPage.title", { lng: "en" })
    );
    console.log(
      "mainPage.title (ko):",
      i18n.t("mainPage.title", { lng: "ko" })
    );

    // 현재 언어로 번역
    console.log("t('mainPage.title'):", t("mainPage.title"));
  }, [i18n.language]);

  useEffect(() => {
    const handleLanguageChange = () => {
      console.log("🔥 Language changed event in MainPage:", i18n.language);
    };

    i18n.on("languageChanged", handleLanguageChange);

    return () => {
      i18n.off("languageChanged", handleLanguageChange);
    };
  }, [i18n]);

  console.log("MainPage render - current language:", i18n.language);
  console.log("MainPage render - title:", t("mainPage.title"));

  useEffect(() => {
    loadRecommendations();
  }, [currentUser]);

  const loadRecommendations = async () => {
    if (!currentUser) return;

    try {
      const q = query(
        collection(db, "diet"),
        where("user_id", "==", currentUser.uid),
        limit(10)
      );

      const querySnapshot = await getDocs(q);
      const loaded: Diet[] = [];

      querySnapshot.forEach((doc) => {
        const data = doc.data() as Diet;
        loaded.push({ ...data, diet_id: doc.id });
      });

      setRecommendations(loaded);
    } catch (error) {
      console.error("추천 이력 로드 실패:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRecommendationSuccess = (result: string) => {
    setResultData(result);
    setPageState("result");
    loadRecommendations();
  };

  if (pageState === "form") {
    return (
      <MenuRecommendationForm
        onBack={() => setPageState("view")}
        onSuccess={handleRecommendationSuccess}
      />
    );
  }

  if (pageState === "result") {
    return (
      <MenuRecommendationResult
        result={resultData}
        onBack={() => setPageState("view")}
      />
    );
  }

  if (pageState === "detail" && selectedRec) {
    return (
      <div className="space-y-6">
        <button
          onClick={() => setPageState("view")}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-2 transition"
        >
          <span className="font-medium">← {t("mainPage.back")}</span>
        </button>

        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">
                {selectedRec.diet_name}
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                {new Date(
                  selectedRec.created_date || selectedRec.diet_create_date
                ).toLocaleString(i18n.language)}
              </p>
            </div>
          </div>

          <div className="prose prose-sm max-w-none bg-gray-50 p-6 rounded-lg text-gray-800">
            <ReactMarkdown>{selectedRec.diet_content}</ReactMarkdown>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-br from-orange-500 to-amber-500 rounded-2xl shadow-lg p-8 text-white">
        <div className="flex items-center gap-3 mb-4">
          <Sparkles className="w-8 h-8" />
          <h2 className="text-2xl font-bold">{t("mainPage.title")}</h2>
        </div>

        <div className="bg-white/20 backdrop-blur-sm rounded-xl p-6">
          <p className="text-xl mb-4">{t("mainPage.subtitle")}</p>
          <button
            onClick={() => setPageState("form")}
            className="bg-white text-orange-500 font-semibold px-6 py-3 rounded-lg hover:bg-orange-50 transition"
          >
            {t("mainPage.getRecommendation")}
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-lg p-6">
        <div className="flex items-center gap-2 mb-4">
          <Clock className="w-5 h-5 text-orange-500" />
          <h3 className="text-xl font-bold text-gray-800">
            {t("mainPage.historyTitle")}
          </h3>
        </div>

        {loading ? (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-orange-500 border-t-transparent"></div>
          </div>
        ) : recommendations.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 mb-4">{t("mainPage.empty")}</p>
            <button
              onClick={() => setPageState("form")}
              className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-6 py-2 rounded-lg transition"
            >
              {t("mainPage.firstRecommend")}
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {recommendations.map((rec) => (
              <div
                key={rec.diet_id}
                role="button"
                tabIndex={0}
                onClick={() => {
                  setSelectedRec(rec);
                  setPageState("detail");
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    setSelectedRec(rec);
                    setPageState("detail");
                  }
                }}
                className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition cursor-pointer"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="text-sm text-gray-500">
                      {new Date(rec.created_date).toLocaleDateString(
                        i18n.language,
                        {
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        }
                      )}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      {t("mainPage.recommendedFor", { name: rec.diet_name })}
                    </p>
                  </div>
                </div>
                <div className="prose prose-sm max-w-none text-gray-700">
                  <div className="line-clamp-3">
                    <ReactMarkdown>{rec.diet_content}</ReactMarkdown>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
