//파이어베이스 유저 인증 관련 함수
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "../../lib/firebase";
import { v4 as uuidv4 } from "uuid";

//현재 로그인된 유저의 id를 반환하는 함수
export async function getCurrentUserId() {
  const user = auth.currentUser;
  if (user) {
    return user.uid; // ✅ uid 바로 사용 가능
  } else {
    // 아직 로그인 전이라면, 로그인 상태 변화를 기다려야 함
    return new Promise<string | null>((resolve) => {
      const unsubscribe = auth.onAuthStateChanged((u) => {
        unsubscribe();
        resolve(u ? u.uid : null);
      });
    });
  }
}

//유저 처음에 회원가입시에 기본적인 유저 상태를 생성하는 함수
//1. 기본
//2. 다이어트
export async function createDefaultUserState() {
  const uid = await getCurrentUserId();
  if (!uid) {
    console.error("User ID가 존재하지 않습니다.");
    return;
  }

  //기본 - 다이어트 정보
  const userState = {
    user_state_id: uuidv4(),
    user_id: uid,
    user_state_name: "다이어트",
    user_state_description:
      "채중감량을 중점으로 한 다이어트를 위한 식단을 위한 상태",
    user_state_info:
      "칼로리가 적고 영양소가 많은 음식위주로 식단을 구성하여 주세요",
    user_state_is_main: false,
  };

  //기본 - 전반적 정보
  const defaultUserState = {
    user_state_id: uuidv4(),
    user_id: uid,
    user_state_name: "기본",
    user_state_description: "기본적인 상태",
    user_state_info: "전반적으로 균형잡힌 식단을 구성하여 주세요",
    user_state_is_main: true,
  };

  //기본 - 다이어트 정보
  await setDoc(doc(db, "user_states", userState.user_state_id), userState);

  //기본 - 전반적 정보
  await setDoc(
    doc(db, "user_states", defaultUserState.user_state_id),
    defaultUserState
  );
}
