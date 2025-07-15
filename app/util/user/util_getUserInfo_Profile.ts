import {
  ErrorReturnDto,
  GetUserInfoReturnDto_Profile,
} from '../../types/util_types/dto/userDto';
import { db } from '../../firebase/firebase';
import { doc, getDoc } from 'firebase/firestore';

export async function util_getUserInfoDto(): Promise<
  GetUserInfoReturnDto_Profile | ErrorReturnDto
> {
  const userDocRef = doc(db, 'user', 'USER_ID');
  const userSnap = await getDoc(userDocRef);
  const userData = userSnap.data();

  if (!userData) {
    return {
      message: '사용자 정보를 찾을 수 없습니다.',
      type: 'error',
    };
  }

  return {
    type: 'success',
    name: userData.user_name,
    email: userData.user_email,
    user_search_count: userData.user_search_count,
    user_dark_mode: userData.user_dark_mode,
    user_instagram_auto_sharing: userData.user_instagram_auto_sharing,
    user_search_total_count: userData.user_search_total_count,
    user_img_avg_score: userData.user_img_avg_score,
  };
}
