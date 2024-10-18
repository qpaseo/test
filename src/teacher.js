// 파이어베이스 데이터베이스 접근(선생님 정보 조정)
// 실행전에 json파일 확인

import { initializeApp } from "firebase/app";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import {
  collection,
  getDocs,
  getFirestore,
  setDoc,
  doc,
  query,
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

//파이어베이스 변수
const teacherCol = collection(db, "teacher");
const teacherSnapshot = await getDocs(teacherCol);
const teacherList = teacherSnapshot.docs.map((doc) => doc.data());
const teacherListLen = teacherList.length;

// 선생님 데이터 << 로그인시 받아와서 저장
const teacherName = "김상숙";
const communicationState = false;
const location = "수학실";
const state = "회의중";
const teacherEmail = "qwer1234@gmail.com";

// Firestore에서 선생 목록 가져오기
async function getTeachers() {
  try {
    console.log("선생님 목록");
    console.log("=============");
    console.log(teacherList);
  } catch (error) {
    console.error("선생님의 목록을 불러오는데에 실패하였습니다.", error);
  }
}

// Firestore에서 특정 선생만 가져오기
async function findTeacher(email) {
  for (var number = 0; number < teacherListLen; number++) {
    if (teacherList[number].email === email) {
      console.log(`${teacherList[number].name} 선생님의 정보입니다.`);
      console.log(teacherList[number]);
    }
  }
}

// Firestore에서 선생 목록 추가하기 teacher 아레에 추가
async function pushTeacher(
  teacherName,
  communicationState,
  location,
  state,
  teacherEmail
) {
  const document_name = teacherEmail;
  const teacheRef = doc(db, "teacher", document_name);

  try {
    await setDoc(teacheRef, {
      email: teacherEmail,
      name: teacherName,
      communicationState: communicationState,
      location: location,
      state: state,
    });
    console.log("=======================");
    console.log(`${teacherName} 선생님이 성공적으로 생성되었습니다.`);
  } catch (error) {
    console.error("선생님을 추가하는데에 실패하였습니다.", error);
  }
}


// 선생님 연락여부 변경
async function ChangeTeacherCommunicationState(email, communicationState) {
  const document_name = teacherEmail;
  const teacheRef = doc(db, "teacher", document_name);
  for (var number = 0; number < teacherListLen; number++) {
    if (teacherList[number].email === email) {
      teacherList[number].state = state;
      await setDoc(
        teacheRef,
        {
          communicationState: !communicationState,
        },
        { merge: true }
      );
      console.log(
        `${
          teacherList[number].name
        } 선생님의 연락여부가 ${!communicationState}으로 변경 되었습니다.`
      );
    }
  }
}

//선생님 위치 변경
async function ChangeTeacherLocation(email, location) {
  const document_name = teacherEmail;
  const teacheRef = doc(db, "teacher", document_name);
  for (var number = 0; number < teacherListLen; number++) {
    if (teacherList[number].email === email) {
      teacherList[number].state = state;
      await setDoc(
        teacheRef,
        {
          location: location,
        },
        { merge: true }
      );
      console.log(
        `${teacherList[number].name} 선생님의 위치가 ${location}으로 변경 되었습니다.`
      );
    }
  }
}

//선생님 상테 변경
async function ChangeTeacherstate(email, state) {
  const document_name = teacherEmail;
  const teacheRef = doc(db, "teacher", document_name);
  for (var number = 0; number < teacherListLen; number++) {
    if (teacherList[number].email === email) {
      teacherList[number].state = state;
      await setDoc(
        teacheRef,
        {
          state: state,
        },
        { merge: true }
      );
      console.log(
        `${teacherList[number].name} 선생님의 상테가 ${teacherList[number].state}으로 변경 되었습니다.`
      );
    }
  }
}

//선생님 불러오기
//getTeachers();
//선생님 찾기 (+ 찾은뒤에는 정보 가져오기 [변수에 저장하기])
//findTeacher(teacherEmail);
//선생님 추가하기
//pushTeacher(teacherName, communicationState, location, state, teacherEmail);
//선생님 연락여부 변경
//ChangeTeacherCommunicationState(teacherEmail, communicationState);
//선생님 위치변경
//ChangeTeacherLocation(teacherEmail,location);
//선생님 상태변경
//ChangeTeacherstate(teacherEmail, state);
