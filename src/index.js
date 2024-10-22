import { signUp, signIn } from "./login.js";
import { createStudent, creatework, findstudent, findwork } from "./student/js";
import {
  getTeachers,
  findTeacher,
  pushTeacher,
  ChangeTeacherCommunicationState,
  ChangeTeacherLocation,
  ChangeTeacherstate,
} from "./teacher.js";

//// 학생정보
const studentEmail = "Lee_Kyung-min@gmail.com"; // 이메일로 구분함 (중복되면 변경됨)
const studentName = "이경민";
const studentWorks = {};

//유저 데이터
const email = "qazcgik@gmail.com";
const password = "qp10alzmalzm";
const name = "서현동";

//학생 일정 추가
const Todo = "학습지 작성하기";
const TodoTeacher = "강원석";
const workStartDate = "2024/10/18";
const workEndDate = "2024/10/20";

// 선생님 데이터 << 로그인시 받아와서 저장
const teacherName = "김상숙";
const communicationState = false;
const location = "수학실";
const state = "회의중";
const teacherEmail = "qwer1234@gmail.com";

//오늘의 날짜
const toDay = new Date();
const formattedDate = `${toDay.getFullYear()}/${
  toDay.getMonth() + 1
}/${toDay.getDate()}`;

// 회원가입
//signUp(auth, email, password);
// 로그인
//signIn(auth, email, password);

//학생 추가하기
//createStudent(studentEmail, studentName, studentWorks);
//일정추가하기
//creatework(studentEmail, Todo, TodoTeacher, workStartDate, workEndDate);
//학생 찾기
//findstudent(studentEmail);
//일정 보여주기 : 날짜에 따라
//findwork(studentEmail,formattedDate);

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

