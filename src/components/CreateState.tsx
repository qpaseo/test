import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../lib/firebase";
import { useAuth } from "../contexts/AuthContext";
import { ArrowLeft } from "lucide-react";
import { useTranslation } from "react-i18next";

interface CreateStateProps {
  onBack: () => void;
  onSuccess: () => void;
}

export default function CreateState({ onBack, onSuccess }: CreateStateProps) {
  const { currentUser } = useAuth();
  const { t } = useTranslation();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    info: "",
    isMain: false,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;

    setLoading(true);
    setError("");

    try {
      await toast.promise(
        addDoc(collection(db, "user_states"), {
          user_id: currentUser.uid,
          user_state_name: formData.name,
          user_state_description: formData.description,
          user_state_info: formData.info,
          user_state_is_main: formData.isMain,
          created_at: new Date().toISOString(),
        }),
        {
          pending: t("statesPage.create.pending"),
          success: t("statesPage.create.success"),
          error: t("statesPage.create.error"),
        }
      );

      onSuccess();
    } catch (err) {
      setError(t("statesPage.create.error"));
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;

    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData({ ...formData, [name]: checked });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  return (
    <div>
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-6 transition"
      >
        <ArrowLeft className="w-5 h-5" />
        <span className="font-medium">{t("mainPage.back")}</span>
      </button>

      <div className="bg-white rounded-2xl shadow-lg p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          {t("statesPage.addState")}
        </h2>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* 상태 이름 */}
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              {t("form.name")}
            </label>
            <input
              id="name"
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition"
              placeholder={t("placeholder.name")}
              required
            />
          </div>

          {/* 상태 설명 */}
          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              {t("form.description")}
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition resize-none"
              placeholder={t("placeholder.description")}
              required
            />
          </div>

          {/* 추천 기준 */}
          <div>
            <label
              htmlFor="info"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              {t("form.info")}
            </label>
            <textarea
              id="info"
              name="info"
              value={formData.info}
              onChange={handleChange}
              rows={3}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition resize-none"
              placeholder={t("placeholder.info")}
              required
            />
          </div>

          {/* 메인 상태 설정 */}
          <div className="flex items-center gap-3">
            <input
              id="isMain"
              type="checkbox"
              name="isMain"
              checked={formData.isMain}
              onChange={handleChange}
              className="w-5 h-5 text-orange-500 border-gray-300 rounded focus:ring-2 focus:ring-orange-500"
            />
            <label
              htmlFor="isMain"
              className="text-sm font-medium text-gray-700"
            >
              {t("form.setMain")}
            </label>
          </div>

          {/* 버튼 */}
          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={onBack}
              className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-3 rounded-lg transition"
            >
              {t("statesPage.cancel")}
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading
                ? t("statesPage.create.loading")
                : t("statesPage.addState")}
            </button>
          </div>
        </form>
      </div>

      <ToastContainer position="top-right" autoClose={2000} hideProgressBar />
    </div>
  );
}
