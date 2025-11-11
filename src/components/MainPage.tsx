import { useEffect, useState } from "react";
import { Sparkles, Clock } from "lucide-react";
import { collection, query, where, getDocs, limit } from "firebase/firestore";
import { db } from "../lib/firebase";
import { useAuth } from "../contexts/AuthContext";
import MenuRecommendationForm from "./MenuRecommendationForm";
import MenuRecommendationResult from "./MenuRecommendationResult";
import ReactMarkdown from "react-markdown";
import { getCurrentUserId } from "../util/firebase/firebase-user-auth";
import { Diet } from "../types/entity";

type MainPageState = "view" | "form" | "result";

export default function MainPage() {
  const { currentUser } = useAuth();
  const [pageState, setPageState] = useState<MainPageState>("view");
  const [recommendations, setRecommendations] = useState<Diet[]>([]);
  const [resultData, setResultData] = useState<string>("");
  const [loading, setLoading] = useState(true);

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

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-br from-orange-500 to-amber-500 rounded-2xl shadow-lg p-8 text-white">
        <div className="flex items-center gap-3 mb-4">
          <Sparkles className="w-8 h-8" />
          <h2 className="text-2xl font-bold">오늘의 메뉴</h2>
        </div>

        <div className="bg-white/20 backdrop-blur-sm rounded-xl p-6">
          <p className="text-xl mb-4">오늘 메뉴는 어떤 걸로 하실래요?</p>
          <button
            onClick={() => setPageState("form")}
            className="bg-white text-orange-500 font-semibold px-6 py-3 rounded-lg hover:bg-orange-50 transition"
          >
            추천받기
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-lg p-6">
        <div className="flex items-center gap-2 mb-4">
          <Clock className="w-5 h-5 text-orange-500" />
          <h3 className="text-xl font-bold text-gray-800">추천 이력</h3>
        </div>

        {loading ? (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-orange-500 border-t-transparent"></div>
          </div>
        ) : recommendations.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 mb-4">아직 추천받은 식단이 없습니다</p>
            <button
              onClick={() => setPageState("form")}
              className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-6 py-2 rounded-lg transition"
            >
              첫 추천받기
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {recommendations.map((rec) => (
              <div
                key={rec.diet_id}
                className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="text-sm text-gray-500">
                      {new Date(rec.created_date).toLocaleDateString("ko-KR", {
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      {rec.diet_name} 추천
                    </p>
                  </div>
                </div>
                <div className="prose prose-sm max-w-none text-gray-700">
                  <ReactMarkdown className="line-clamp-3">
                    {rec.diet_content}
                  </ReactMarkdown>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
