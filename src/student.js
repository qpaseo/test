// 학생 생성과 일 추가
// 실행전에 json파일 확인

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

// Firebase 앱 초기화=
const app = initializeApp(firebaseConfig);

// Firestore 초기화
const db = getFirestore(app);

// 인증 초기화
const auth = getAuth(app);

//파이어베이스 변수
const studentCol = collection(db, "student");
const studentSnapshot = await getDocs(studentCol);
const studentList = studentSnapshot.docs.map((doc) => doc.data());
const studentListLen = studentList.length;

//// 학생정보
const studentEmail = "1234abcd@gmail.com"; // 이메일로 구분함 (중복되면 변경됨)
const studentName = "박세희";
const studentWorks = {};

//학생 일정 추가
const Todo = "숙제하기";
const TodoTeacher = "정미숙";
const workDate = "2024/3/12";

//오늘의 날짜

const toDay = new Date
console.log(
  `${toDay.getFullYear()}/${toDay.getMonth() + 1}/${Date().getDate()}`
);

// 학생 생성
async function createStudent(email, name, works) {
  const document_name = email;

  try {
    const teacheRef = doc(db, "student", document_name);
    await setDoc(teacheRef, {
      email: email,
      name: name,
      works: works,
    });
  } catch (error) {
    console.error("학생 생성 실패:", error);
  }
}

// 일정추가
async function creatework(email, Todo, TodoTeacher, date) {
  for (var number = 0; number < studentListLen; number++) {
    if (studentList[number].email == email) {
      const studenRef = doc(db, "student", email);

      //console.log(studentList[number].works)

      if (studentList[number].works != undefined) {
        const key =
          studentList[number].works === undefined
            ? 1
            : Object.keys(studentList[number].works).length + 1;
        try {
          await setDoc(
            studenRef,
            {
              works: {
                [key]: {
                  Todo: Todo,
                  TodoTeacher: TodoTeacher,
                  date: date,
                },
              },
            },
            { merge: true }
          );
          console.log(
            `${studentList[number].name}에게 ${TodoTeacher} 가 시키신일 ${Todo} ${date} 까지 하기가 생성 되었습니다.`
          );
        } catch (error) {
          console.error("일정 추가 실패:", error);
        }
      } else {
        try {
          await setDoc(
            studenRef,
            {
              works: {
                1: {
                  Todo: Todo,
                  TodoTeacher: TodoTeacher,
                  date: date,
                },
              },
            },
            { merge: true }
          );
          console.log(
            `${studentList[number].name}에게 ${TodoTeacher}이(가) 시키신일 ${Todo} ${date} 까지 하기가 생성 되었습니다.`
          );
        } catch (error) {
          console.error("일정 추가 실패:", error);
        }
      }
    }
  }
}

// 학생 이베일  단일 조회
async function findstudent(email) {
  for (var number = 0; number < studentListLen; number++) {
    if (studentList[number].name === "박세희") {
      console.log(studentList[number]);
    }
  }
}

async function findwork(email, date) {
  for (var number = 0; number < studentListLen; number++) {
    if (studentList[number].name === "박세희") {
      console.log(studentList[number].works.length);
    }
  }
}

//학생 추가하기
//createStudent(studentEmail, studentName, studentWorks);
//일정추가하기
//creatework(studentEmail, Todo, TodoTeacher, workDate);
//학생 찾기
//findstudent(studentEmail);
//일정 보여주기 : 날짜에 따라
findwork(studentEmail,date);
