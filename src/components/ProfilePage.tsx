import { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../lib/firebase";
import { useAuth } from "../contexts/AuthContext";
import { User as UserIcon, Save } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function ProfilePage() {
  const { currentUser } = useAuth();
  const { t } = useTranslation();

  const [formData, setFormData] = useState({
    email: "",
    name: "",
    foodTypes: "",
    foodCategories: "",
    language: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

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
          foodTypes: data.user_food_types || "",
          foodCategories: data.user_food_categories || "",
          language: data.user_language || "",
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

    try {
      await toast.promise(
        updateDoc(doc(db, "users", currentUser.uid), {
          name: formData.name,
          user_food_types: formData.foodTypes,
          user_food_categories: formData.foodCategories,
          user_language: formData.language,
          updated_at: new Date().toISOString(),
        }),
        {
          pending: t("profilePage.updatePending"),
          success: t("profilePage.updateSuccess"),
          error: t("profilePage.updateError"),
        }
      );
    } catch (error) {
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
          <h2 className="text-2xl font-bold text-gray-800">
            {t("profilePage.title")}
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* 선호 식재료 */}
          <div>
            <label
              htmlFor="foodTypes"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              {t("profilePage.foodTypes")}
            </label>
            <select
              id="foodTypes"
              name="foodTypes"
              value={formData.foodTypes}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition"
              required
            >
              <option value="">{t("profilePage.selectPlaceholder")}</option>
              <option value="해산물">
                {t("profilePage.foodTypesOptions.seafood")}
              </option>
              <option value="육류">
                {t("profilePage.foodTypesOptions.meat")}
              </option>
              <option value="채소">
                {t("profilePage.foodTypesOptions.vegetable")}
              </option>
            </select>
          </div>

          {/* 선호 음식 카테고리 */}
          <div>
            <label
              htmlFor="foodCategories"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              {t("profilePage.foodCategories")}
            </label>
            <select
              id="foodCategories"
              name="foodCategories"
              value={formData.foodCategories}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition"
              required
            >
              <option value="">{t("profilePage.selectPlaceholder")}</option>
              <option value="한식">
                {t("profilePage.foodCategoriesOptions.korean")}
              </option>
              <option value="양식">
                {t("profilePage.foodCategoriesOptions.western")}
              </option>
              <option value="중식">
                {t("profilePage.foodCategoriesOptions.chinese")}
              </option>
            </select>
          </div>

          {/* 언어 */}
          <div>
            <label
              htmlFor="language"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              {t("profilePage.language")}
            </label>
            <select
              id="language"
              name="language"
              value={formData.language}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition"
              required
            >
              <option value="">{t("profilePage.selectPlaceholder")}</option>
              <option value="ko">
                {t("profilePage.languageOptions.korean")}
              </option>
              <option value="en">
                {t("profilePage.languageOptions.english")}
              </option>
            </select>
          </div>

          {/* 저장 버튼 */}
          <button
            type="submit"
            disabled={saving}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <Save className="w-5 h-5" />
            {saving ? t("profilePage.saving") : t("profilePage.saveButton")}
          </button>
        </form>
      </div>
      <ToastContainer position="top-right" autoClose={2000} hideProgressBar />
    </div>
  );
}
