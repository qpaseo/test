// 학생 생성과 일 추가
// npm run student

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
const studentEmail = "Lee_Kyung-min@gmail.com"; // 이메일로 구분함 (중복되면 변경됨)
const studentName = "이경민";
const studentWorks = {};

//학생 일정 추가
const Todo = "학습지 작성하기";
const TodoTeacher = "강원석";
const workStartDate = "2024/10/18";
const workEndDate = "2024/10/20";

//오늘의 날짜

const toDay = new Date();
const formattedDate = `${toDay.getFullYear()}/${
  toDay.getMonth() + 1
}/${toDay.getDate()}`;

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
    console.log(`${name} 학생이 추가되었습니다.`);
  } catch (error) {
    console.error("학생 생성 실패:", error);
  }
}

// 일정추가
async function creatework(
  email,
  Todo,
  TodoTeacher,
  workStartDate,
  workEndDate
) {
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
                  workStartDate: workStartDate,
                  workEndDate: workEndDate,
                },
              },
            },
            { merge: true }
          );
          console.log(
            `${studentList[number].name}에게 ${TodoTeacher} 선생님이 시키신일인 ${Todo}가 ${workStartDate}부터 ${workEndDate}까지 생성 되었습니다.`
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
                [key]: {
                  Todo: Todo,
                  TodoTeacher: TodoTeacher,
                  workStartDate: workStartDate,
                  workEndDate: workEndDate,
                },
              },
            },
            { merge: true }
          );
          console.log(
            `${studentList[number].name}에게 ${TodoTeacher} 선생님이 시키신일인 ${Todo}가 ${workStartDate}부터 ${workEndDate}까지 생성 되었습니다.`
          );
        } catch (error) {
          console.error("일정 추가 실패:", error);
        }
      }
    }
  }
}

// 학생 이메일  단일 조회
async function findstudent(email) {
  for (var number = 0; number < studentListLen; number++) {
    if (studentList[number].email === email) {
      console.log(`${studentList[number].name} 학생의 정보입니다.`);
      console.log(`==============================================`);
      console.log(studentList[number]);
    }
  }
}

async function findwork(email) {
  var count = 0;
  console.log("일정목록");
  console.log("===================");
  for (var number = 0; number < studentListLen; number++) {
    if (studentList[number].email === email) {
      const studentworksLen = Object.keys(studentList[number].works).length;
      for (var workIndex = 1; workIndex < studentworksLen + 1; workIndex++) {
        const start =
          studentList[number].works[workIndex].workStartDate.split("/");
        const end = studentList[number].works[workIndex].workEndDate.split("/");

        const now = new Date(); // 현재 날짜를 now 변수에 할당
        const startDate = new Date(start[0], start[1] - 1, start[2]);
        const endDate = new Date(end[0], end[1] - 1, end[2]);
        const currentDate = new Date(
          now.getFullYear(),
          now.getMonth(),
          now.getDate()
        );

        if (startDate >= currentDate && currentDate <= endDate) {
          console.log(studentList[number].works[workIndex]);
          count+=1
        }
      }
    }
  }
  console.log("===================");
  console.log(`오늘 ${count}개의 일정이 있어요`);
}

//학생 추가하기
//createStudent(studentEmail, studentName, studentWorks);
//일정추가하기
//creatework(studentEmail, Todo, TodoTeacher, workStartDate, workEndDate);
//학생 찾기
//findstudent(studentEmail);
//일정 보여주기 : 날짜에 따라
findwork(studentEmail,formattedDate);
