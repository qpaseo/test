import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../lib/firebase";
import { useAuth } from "../contexts/AuthContext";
import { ArrowLeft } from "lucide-react";

interface CreateStateProps {
  onBack: () => void;
  onSuccess: () => void;
}

export default function CreateState({ onBack, onSuccess }: CreateStateProps) {
  const { currentUser } = useAuth();
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
          pending: "상태 생성 중... ",
          success: "상태가 생성되었습니다!",
          error: "상태 생성에 실패했습니다.",
        }
      );

      onSuccess();
    } catch (err) {
      setError("상태 생성에 실패했습니다.");
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
        <span className="font-medium">돌아가기</span>
      </button>

      <div className="bg-white rounded-2xl shadow-lg p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          새 상태 만들기
        </h2>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              상태 이름
            </label>
            <input
              id="name"
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition"
              placeholder="예: 다이어트"
              required
            />
          </div>

          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              상태 설명
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition resize-none"
              placeholder="예: 체중 감량을 위한 다이어트"
              required
            />
          </div>

          <div>
            <label
              htmlFor="info"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              추천 기준
            </label>
            <textarea
              id="info"
              name="info"
              value={formData.info}
              onChange={handleChange}
              rows={3}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition resize-none"
              placeholder="예: 칼로리가 적고 영양소가 많은 음식 위주로"
              required
            />
          </div>

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
              이 상태를 메인 상태로 설정
            </label>
          </div>

          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={onBack}
              className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-3 rounded-lg transition"
            >
              취소
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "생성 중..." : "생성하기"}
            </button>
          </div>
        </form>
      </div>
      <ToastContainer position="top-right" autoClose={2000} hideProgressBar />
    </div>
  );
}
