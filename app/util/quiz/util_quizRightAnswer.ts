//퀴즈 정답시 사용자 검색 횟수 증가

import { QuizRightAnswerDto } from '../../types/util_types/dto/quizDto';
import { db } from '../../firebase/firebase';
import {
  collection,
  query,
  where,
  getDocs,
  updateDoc,
} from 'firebase/firestore';

export async function util_quizRightAnswer(
  quizRightAnswerDto: QuizRightAnswerDto
): Promise<void> {
  const usersColRef = collection(db, 'user');
  const q = query(
    usersColRef,
    where('user_email', '==', quizRightAnswerDto.email)
  );
  const querySnap = await getDocs(q);

  if (!querySnap.empty) {
    const userDoc = querySnap.docs[0];
    const userRef = userDoc.ref;
    const currentCount = userDoc.data().user_search_count || 0;
    await updateDoc(userRef, {
      user_search_count: currentCount + 1,
    });
  }
}
