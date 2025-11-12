import { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../lib/firebase";
import { useAuth } from "../contexts/AuthContext";
import { User as UserIcon, Save } from "lucide-react";

export default function ProfilePage() {
  const { currentUser } = useAuth();
  const [formData, setFormData] = useState({
    email: "",
    name: "",
    foodTypes: "",
    foodCategories: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    loadUserData();
  }, [currentUser]);

  const loadUserData = async () => {
    if (!currentUser) return;

    try {
      const userDoc = await getDoc(doc(db, "users", currentUser.uid));
      if (userDoc.exists()) {
        const data = userDoc.data();
        setFormData({
          email: data.email || "",
          name: data.name || "",
          foodTypes: data.food_types || "",
          foodCategories: data.food_categories || "",
        });
      }
    } catch (error) {
      console.error("사용자 정보 로드 실패:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;

    setSaving(true);
    setMessage("");

    try {
      await toast.promise(
        updateDoc(doc(db, "users", currentUser.uid), {
          name: formData.name,
          food_types: formData.foodTypes,
          food_categories: formData.foodCategories,
          updated_at: new Date().toISOString(),
        }),
        {
          pending: "프로필 업데이트 중...",
          success: "프로필이 업데이트되었습니다!",
          error: "프로필 업데이트에 실패했습니다.",
        }
      );

      setMessage("프로필이 성공적으로 업데이트되었습니다.");
    } catch (error) {
      setMessage("프로필 업데이트에 실패했습니다.");
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-orange-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-2xl shadow-lg p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-orange-500 p-3 rounded-full">
            <UserIcon className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800">프로필 설정</h2>
        </div>

        {message && (
          <div
            className={`px-4 py-3 rounded-lg mb-6 ${
              message.includes("성공")
                ? "bg-green-50 border border-green-200 text-green-700"
                : "bg-red-50 border border-red-200 text-red-700"
            }`}
          >
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="foodTypes"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              선호 식재료
            </label>
            <select
              id="foodTypes"
              name="foodTypes"
              value={formData.foodTypes}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition"
              required
            >
              <option value="">선택해주세요</option>
              <option value="해산물">해산물</option>
              <option value="육류">육류</option>
              <option value="채소">채소</option>
            </select>
          </div>

          <div>
            <label
              htmlFor="foodCategories"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              선호 음식 카테고리
            </label>
            <select
              id="foodCategories"
              name="foodCategories"
              value={formData.foodCategories}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition"
              required
            >
              <option value="">선택해주세요</option>
              <option value="한식">한식</option>
              <option value="양식">양식</option>
              <option value="중식">중식</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <Save className="w-5 h-5" />
            {saving ? "저장 중..." : "변경사항 저장"}
          </button>
        </form>
      </div>
      <ToastContainer position="top-right" autoClose={2000} hideProgressBar />
    </div>
  );
}
