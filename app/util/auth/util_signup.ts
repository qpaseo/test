import { auth, db } from '../../firebase/firebase';
import {
  ErrorReturnDto,
  SignupDto,
  SignupReturnDto,
} from '../../types/util_types/dto/authDto';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { SignupEntity } from '../../types/util_types/entity/aurhEntity';

export async function util_signUp(
  signupDto: SignupDto
): Promise<SignupReturnDto | ErrorReturnDto> {
  const { email, password, name } = signupDto;
  const userCredential = await createUserWithEmailAndPassword(
    auth,
    email,
    password
  );
  const user = userCredential.user;

  const setUserData: SignupEntity = {
    user_name: name,
    user_email: email,
    user_search_count: 5,
    user_today_quiz_complete: false,
    user_dark_mode: false,
    user_instagram_auto_sharing: false,
    user_search_total_count: 0,
    user_img_avg_score: 0,
    user_grade: 'General',
  };

  await setDoc(doc(db, 'users', user.uid), setUserData);

  return {
    type: 'success',
    message: '회원가입 완료! 이메일을 확인하고 인증을 진행해주세요.',
  };
}
