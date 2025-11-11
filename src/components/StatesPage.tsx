import { useState, useEffect } from "react";
import { Plus, Star, Edit2, Trash2 } from "lucide-react";
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import { db } from "../lib/firebase";
import { useAuth } from "../contexts/AuthContext";
import { UserState } from "../types";
import CreateState from "./CreateState";

export default function StatesPage() {
  const { currentUser } = useAuth();
  const [states, setStates] = useState<UserState[]>([]);
  const [mainState, setMainState] = useState<UserState | null>(null);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);

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
      console.log("querySnapshot", querySnapshot.docs);

      const loadedStates: UserState[] = [];
      querySnapshot.docs.forEach((doc) => {
        const data = doc.data() as UserState;
        console.log("data", data);
        loadedStates.push({ ...data, user_state_id: doc.id });

        if (data.user_state_is_main) {
          setMainState({ ...data, user_state_id: doc.id });
        }
      });

      setStates(loadedStates);
    } catch (error) {
      console.error("상태 로드 실패:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSetMain = async (stateId: string) => {
    if (!currentUser) return;

    try {
      if (mainState) {
        await updateDoc(doc(db, "user_states", mainState.user_state_id), {
          user_state_is_main: false,
        });
      }

      await updateDoc(doc(db, "user_states", stateId), {
        user_state_is_main: true,
      });

      await loadStates();
    } catch (error) {
      console.error("메인 상태 설정 실패:", error);
    }
  };

  const handleDelete = async (stateId: string) => {
    if (!confirm("정말 삭제하시겠습니까?")) return;

    try {
      await deleteDoc(doc(db, "user_states", stateId));
      await loadStates();
    } catch (error) {
      console.error("상태 삭제 실패:", error);
    }
  };

  if (showCreateForm) {
    return (
      <CreateState
        onBack={() => setShowCreateForm(false)}
        onSuccess={() => {
          setShowCreateForm(false);
          loadStates();
        }}
      />
    );
  }

  return (
    <div className="space-y-6">
      {mainState && (
        <div className="bg-gradient-to-br from-orange-500 to-amber-500 rounded-2xl shadow-lg p-8 text-white">
          <div className="flex items-center gap-2 mb-3">
            <Star className="w-6 h-6 fill-current" />
            <span className="text-sm font-medium">메인 상태</span>
          </div>
          <h2 className="text-3xl font-bold mb-2">
            {mainState.user_state_name}
          </h2>
          <p className="text-white/90 mb-3">
            {mainState.user_state_description}
          </p>
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3">
            <p className="text-sm">{mainState.user_state_info}</p>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold text-gray-800">내 상태 목록</h3>
        <button
          onClick={() => setShowCreateForm(true)}
          className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold px-4 py-2 rounded-lg transition"
        >
          <Plus className="w-5 h-5" />
          상태 추가
        </button>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-orange-500 border-t-transparent"></div>
        </div>
      ) : states.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
          <p className="text-gray-500 mb-4">아직 등록된 상태가 없습니다</p>
          <button
            onClick={() => setShowCreateForm(true)}
            className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-6 py-3 rounded-lg transition"
          >
            첫 상태 만들기
          </button>
        </div>
      ) : (
        <div className="grid gap-4">
          {states.map((state) => (
            <div
              key={state.user_state_id}
              className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h4 className="text-lg font-bold text-gray-800">
                      {state.user_state_name}
                    </h4>
                    {state.user_state_is_main && (
                      <Star className="w-5 h-5 text-orange-500 fill-current" />
                    )}
                  </div>
                  <p className="text-gray-600 mb-2">
                    {state.user_state_description}
                  </p>
                  <p className="text-sm text-gray-500">
                    {state.user_state_info}
                  </p>
                </div>

                <div className="flex gap-2">
                  {!state.user_state_is_main && (
                    <button
                      onClick={() => handleSetMain(state.user_state_id)}
                      className="p-2 text-gray-400 hover:text-orange-500 transition"
                      title="메인으로 설정"
                    >
                      <Star className="w-5 h-5" />
                    </button>
                  )}
                  <button
                    className="p-2 text-gray-400 hover:text-blue-500 transition"
                    title="수정"
                  >
                    <Edit2 className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(state.user_state_id)}
                    className="p-2 text-gray-400 hover:text-red-500 transition"
                    title="삭제"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
