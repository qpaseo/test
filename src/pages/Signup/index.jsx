import React, { useState } from "react";
import * as S from "./indexStyle";
import { Link } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const SignupData = () => {
  const [signupData, setSignupData] = useState({
    email: "",
    password: "",
    name: "",
    number: 0,
  });
  const navigate = useNavigate();

  const handleForm = (e) => {
    // 받아온 값마다 지정돼있는 name을 signupData에서 찾아 그에 맞는 값을(value) 추가함
    const { name, value } = e.target;
    setSignupData((prev) => ({ ...prev, [name]: value }));
  };

  const onSubmit = async () => {
    try {
      if (signupData.email !== "" && signupData.password !== "" && signupData) {
        // 무조건 모든 input을 작성해야함을 명시
        const res = await axios.post(`http://98.82.78.128/auth/join/student`, {
          email: signupData.email,
          password: signupData.password,
          name: signupData.name,
          number: signupData.number,
        });
        if (res && res.data) {
          // 성공 띄우고 login창으로 navigate
          alert("회원가입 성공");
          navigate("/Login");
        }
      } else {
        alert("모두 작성해주세요.");
      }
    } catch (error) {
      console.log(error);
      alert("네트워크 에러!!!!!!!?!?!");
    }
  };
  return (
    <S.Wrap>
      <S.LogoBox></S.LogoBox>
      <S.LoginBoxWrap>
        <S.LoginBox>
          <h1 style={{ fontWeight: "400" }}>회원가입</h1>
          <S.InputBoxWrap>
            <S.P>아이디</S.P>
            <S.Input
              placeholder="아이디를 입력하세요"
              name="email"
              onChange={handleForm}
            ></S.Input>

            <img
              src="/images/email.png"
              alt=""
              style={{
                position: "absolute",
                width: "1.6vw",
                height: "3vh",
                marginTop: "64px",
                marginLeft: "10px",
              }}
            ></img>
          </S.InputBoxWrap>

          <S.InputBoxWrap>
            <S.P>비밀번호</S.P>
            <S.Input
              placeholder="비밀번호를 입력하세요"
              name="password"
              onChange={handleForm}
              type="password"
            ></S.Input>

            <img
              src="/images/mdi_password.png"
              alt=""
              style={{
                position: "absolute",
                width: "1.7vw",
                height: "3vh",
                marginTop: "64px",
                marginLeft: "10px",
              }}
            ></img>
          </S.InputBoxWrap>

          <S.InputBoxWrap>
            <S.P>이름</S.P>
            <S.Input
              placeholder="이름을 입력하세요"
              name="name"
              onChange={handleForm}
            ></S.Input>

            <img
              src="/images/name_grade.png"
              alt=""
              style={{
                position: "absolute",
                width: "1.7vw",
                height: "3vh",
                marginTop: "64px",
                marginLeft: "10px",
              }}
            ></img>
          </S.InputBoxWrap>

          <S.InputBoxWrap>
            <S.P>학번</S.P>
            <S.Input
              placeholder="학번을 입력하세요"
              name="number"
              onChange={handleForm}
            ></S.Input>

            <img
              src="/images/name_grade.png"
              alt=""
              style={{
                position: "absolute",
                width: "1.7vw",
                height: "3vh",
                marginTop: "64px",
                marginLeft: "10px",
              }}
            ></img>
          </S.InputBoxWrap>

          <S.InputBoxWrap>
            <S.SubmitButton onClick={onSubmit}>회원가입</S.SubmitButton>
            <S.P>
              계정이 있다면?{" "}
              <Link
                to="/Login"
                style={{
                  textDecorationLine: "none",
                  color: "rgba(88, 192, 154, 1)",
                }}
              >
                로그인
              </Link>
            </S.P>
          </S.InputBoxWrap>
        </S.LoginBox>
      </S.LoginBoxWrap>
    </S.Wrap>
  );
};

export default SignupData;
