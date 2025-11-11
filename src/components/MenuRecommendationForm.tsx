import { useState, useEffect } from 'react';
import { collection, query, where, getDocs, addDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../contexts/AuthContext';
import { UserState } from '../types';
import { ArrowLeft, Sparkles } from 'lucide-react';

interface MenuRecommendationFormProps {
  onBack: () => void;
  onSuccess: (result: string) => void;
}

export default function MenuRecommendationForm({ onBack, onSuccess }: MenuRecommendationFormProps) {
  const { currentUser } = useAuth();
  const [states, setStates] = useState<UserState[]>([]);
  const [mainState, setMainState] = useState<UserState | null>(null);
  const [formData, setFormData] = useState({
    stateId: '',
    additionalRequest: '',
    type: 'full_day' as 'full_day' | 'single_meal',
    mealType: 'breakfast' as 'breakfast' | 'lunch' | 'dinner',
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
        collection(db, 'user_states'),
        where('user_id', '==', currentUser.uid)
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
      console.error('상태 로드 실패:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateMockRecommendation = (): string => {
    const mockMenus = {
      full_day: `## 오늘의 추천 식단

### 아침
- 계란 계란말이
- 신선한 샐러드
- 따뜻한 스프
- 통곡물 빵

### 점심
- 구운 생선 정식
- 현미밥
- 미역국
- 여러 반찬

### 저녁
- 두부 스테이크
- 구운 야채
- 현미밥
- 청국장`,
      breakfast: `## 아침 추천 메뉴

- 요거트와 그래놀라
- 신선한 과일
- 통곡물 토스트
- 스크램블 계란`,
      lunch: `## 점심 추천 메뉴

- 소고기 덮밥
- 미역국
- 김치
- 계절 샐러드`,
      dinner: `## 저녁 추천 메뉴

- 연어 구이
- 찐 브로콜리
- 참다래 쌈장
- 매운 김`,
    };

    const key = formData.type === 'full_day' ? 'full_day' : formData.mealType;
    return mockMenus[key as keyof typeof mockMenus] || mockMenus.full_day;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser || !formData.stateId) return;

    setSubmitting(true);

    try {
      const menuResult = generateMockRecommendation();

      await addDoc(collection(db, 'menu_recommendations'), {
        user_id: currentUser.uid,
        user_state_id: formData.stateId,
        additional_request: formData.additionalRequest,
        recommendation_type: formData.type,
        meal_type: formData.type === 'single_meal' ? formData.mealType : null,
        menu_result: menuResult,
        created_at: new Date().toISOString(),
      });

      onSuccess(menuResult);
    } catch (error) {
      console.error('추천 생성 실패:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
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
        <span className="font-medium">돌아가기</span>
      </button>

      <div className="bg-white rounded-2xl shadow-lg p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-orange-500 p-3 rounded-full">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800">식단 추천받기</h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="stateId" className="block text-sm font-medium text-gray-700 mb-2">
              상태 선택
            </label>
            <select
              id="stateId"
              name="stateId"
              value={formData.stateId}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition"
              required
            >
              <option value="">선택해주세요</option>
              {states.map((state) => (
                <option key={state.user_state_id} value={state.user_state_id}>
                  {state.user_state_name}
                  {state.user_state_is_main ? ' (메인)' : ''}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="additionalRequest" className="block text-sm font-medium text-gray-700 mb-2">
              추가 요청사항
            </label>
            <textarea
              id="additionalRequest"
              name="additionalRequest"
              value={formData.additionalRequest}
              onChange={handleChange}
              rows={3}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition resize-none"
              placeholder="예: 오늘은 매운 음식을 주로 먹고 싶어"
            />
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <label className="block text-sm font-medium text-gray-700 mb-4">
              추천 범위
            </label>

            <div className="space-y-4">
              <div>
                <label className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="type"
                    value="full_day"
                    checked={formData.type === 'full_day'}
                    onChange={handleChange}
                    className="w-4 h-4 text-orange-500 border-gray-300 focus:ring-2 focus:ring-orange-500"
                  />
                  <span className="text-sm font-medium text-gray-700">
                    하루 (아침, 점심, 저녁)
                  </span>
                </label>
              </div>

              <div>
                <label className="flex items-center gap-3 mb-3">
                  <input
                    type="radio"
                    name="type"
                    value="single_meal"
                    checked={formData.type === 'single_meal'}
                    onChange={handleChange}
                    className="w-4 h-4 text-orange-500 border-gray-300 focus:ring-2 focus:ring-orange-500"
                  />
                  <span className="text-sm font-medium text-gray-700">
                    선택 (한 끼만)
                  </span>
                </label>

                {formData.type === 'single_meal' && (
                  <div className="ml-7 space-y-2">
                    {(['breakfast', 'lunch', 'dinner'] as const).map((meal) => (
                      <label key={meal} className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="mealType"
                          value={meal}
                          checked={formData.mealType === meal}
                          onChange={handleChange}
                          className="w-3 h-3 text-orange-500 border-gray-300 focus:ring-2 focus:ring-orange-500"
                        />
                        <span className="text-sm text-gray-600">
                          {meal === 'breakfast' && '아침'}
                          {meal === 'lunch' && '점심'}
                          {meal === 'dinner' && '저녁'}
                        </span>
                      </label>
                    ))}
                  </div>
                )}
              </div>
            </div>
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
              disabled={submitting}
              className="flex-1 bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <Sparkles className="w-5 h-5" />
              {submitting ? '추천 중...' : '추천받기'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
