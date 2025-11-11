//파이어베이스 유저 인증 관련 함수
import { auth } from "../../lib/firebase";

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
