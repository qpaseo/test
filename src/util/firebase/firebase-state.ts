import { collection, query, where, getDocs, limit } from "firebase/firestore";
import { db } from "../../lib/firebase";
import { UserState } from "../../types";

//상태 id를 받아서 해당하는 상태를 main으로 만드는 함수
export const setStateMain: (stateId: string) => Promise<boolean> = async (
  stateId: string
) => {
  if (!stateId) {
    console.error("State ID가 존재하지 않습니다.");
    return false;
  }

  try {
    const q = query(
      collection(db, "user_states"),
      where("user_state_id", "==", stateId)
    );

    const querySnapshot = await getDocs(q);
    const loaded: UserState[] = [];

    querySnapshot.forEach((doc) => {
      const data = doc.data() as UserState;
      loaded.push({ ...data, user_state_id: doc.id });
    });

    return true;
  } catch (error) {
    console.error("상태 로드 실패:", error);
    return false;
  }
};
