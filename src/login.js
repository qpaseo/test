// 로그인과 회원가입을 함
// npm run login

//qazcgik@gmail.com
//qp10alzmalzm

import { initializeApp } from "firebase/app";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";

import {
  collection,
  getDocs,
  getFirestore,
  setDoc,
  doc,
} from "firebase/firestore/lite";

// Firebase 프로젝트 설정
const firebaseConfig = {
  apiKey: "AIzaSyD0W2E2lihwEvI6-4utdbCvVrflmQJC6-E",
  authDomain: "test001-a3974.firebaseapp.com",
  projectId: "test001-a3974",
  storageBucket: "test001-a3974.appspot.com",
  messagingSenderId: "795659655623",
  appId: "1:795659655623:web:d4d0358aca3998da8521e2",
  measurementId: "G-MMSS39XDVS",
};

// Firebase 앱 초기화
const app = initializeApp(firebaseConfig);

// Firestore 초기화
const db = getFirestore(app);

// 인증 초기화
const auth = getAuth(app);

const email = "qazcgik@gmail.com";
const password = "qp10alzmalzm";
const name = "서현동";

//회원가입
function signUp(auth, email, password) {
  createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      console.log("회원가입 정보=>>", email, "/", password);
      const user = userCredential.user;
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;

      console.log("error 발생! =>>", errorMessage);

      if (errorCode === "auth/email-already-in-use") {
        console.log("이미 사용된 email입니다.");
      } else if (errorCode === "auth/invalid-email") {
        console.log("제공된 이메일 주소가 유효하지 않은 형식입니다.");
      } else if (errorCode === "auth/weak-password") {
        console.log(
          "너무 약한 비밀번호 입니다. 다시 비밀번호를 확인하여 주세요"
        );
      } else if (errorCode === "auth/operation-not-allowed") {
        console.log(
          "시스템 실행중의 오류가 발생하였습니다, 개발자한테 문의하여 주세요"
        );
      } else {
        console.log(
          "알수 없는 오류가 발생하였습니다, 개발자한테 문의하여 주세요"
        );
      }
    });
}

//로그인
function signIn(auth, email, password) {
  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const user = userCredential.user;
      console.log("로그인된 회원의 정보 =>>", user.email, "/", user.password);
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log("error 발생! =>>", errorCode, errorMessage);

      if (errorCode === "auth/user-not-found") {
        console.log(
          "제공된 이메일 주소에 해당하는 사용자가 존재하지 않습니다."
        );
      } else if (errorCode === "auth/invalid-credential") {
        console.log("입력한 비밀번호가 잘못되었습니다.");
      } else if (errorCode === "auth/user-disabled") {
        console.log("정지된 계정입니다.");
      } else if (errorCode === "auth/invalid-email") {
        console.log("계정이 비활성화된 계정입니다");
      } else if (errorCode === "auth/too-many-requests") {
        console.log(
          "너무 많은 로그인 시도가 발생하여 일시적으로 계정이 차단되었습니다, 일정 시간 후에 다시 시도해 주세요"
        );
      } else if (errorCode === "auth/popup-closed-by-user") {
        console.log("팝업 인증창이 열리지 않았습니다, 설정을 확인하여 주세요");
      } else {
        console.log(
          "알수 없는 오류가 발생하였습니다, 개발자한테 문의하여 주세요"
        );
      }
    });
}

// 회원가입
signUp(auth, email, password);
// 로그인
//signIn(auth, email, password);

