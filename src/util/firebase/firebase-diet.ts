//파이어베이스 매뉴 추천과 관련된 함수

import { collection, query, where, getDocs, limit } from "firebase/firestore";
import { db } from "../../lib/firebase";
import { diet } from "../../types";

//유저 id로 추천 이력 로드 함수
export const findByUserIdDiet: (userId: string) => Promise<diet[]> = async (
  userId: string
) => {
  if (!userId) {
    console.error("User ID가 존재하지 않습니다.");
    return [];
  }

  try {
    const q = query(
      collection(db, "diet"),
      where("user_id", "==", userId),
      limit(10)
    );

    const querySnapshot = await getDocs(q);
    const loaded: diet[] = [];

    querySnapshot.forEach((doc) => {
      const data = doc.data() as diet;
      loaded.push({ ...data, diet_id: doc.id });
    });

    return loaded;
  } catch (error) {
    console.error("추천 이력 로드 실패:", error);
    return [];
  }
};
