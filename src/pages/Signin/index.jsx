import React, { useState } from "react";
import * as S from "./indexStyle";
import { Link } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  //비밀번호 보이기, 안 보이기할 때 쓸 변수
  const [inputType, setInputType] = useState("password");
  const beforeImg = "https://cdn-icons-png.flaticon.com/128/7578/7578269.png"; // 안 보일 때
  const afterImg = "https://cdn-icons-png.flaticon.com/128/158/158746.png"; // 보일 때
  const [imgUrl, setImgUrl] = useState(beforeImg);

  const handleForm = (e) => {
    // 받아온 값마다 지정돼있는 name을 loginData에서 찾아 그에 맞는 값을(value) 추가함
    const { name, value } = e.target;
    setLoginData((prev) => ({ ...prev, [name]: value }));
  };

  const toggleInputType = () => {
    // 비밀번호 보이기, 안 보이기 로직 구현
    setInputType(inputType === "password" ? "text" : "password");
    setImgUrl(imgUrl === beforeImg ? afterImg : beforeImg);
  };

  const onSubmit = async () => {
    try {
      if (loginData.email !== "" && loginData.password !== "") {
        // 무조건 email과 password를 무조건 작성해야함을 명시
        const res = await axios.post(`http://98.82.78.128/auth/login`, {
          email: loginData.email,
          password: loginData.password,
        });
        if (res && res.data) {
          // 정보가 옳으면 로컬스토리지에 토큰들을 저장함.
          localStorage.setItem("ACCESS_TOKEN", res.data.accessToken);
          localStorage.setItem("REFRESH_TOKEN", res.data.refreshToken);
          alert("로그인 성공");
          navigate("/Main");
        }
      } else {
        alert("비번 또는 계정를 꼭 작성하세요.");
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
          <h1 style={{ fontWeight: "400" }}>로그인</h1>
          <S.InputBoxWrap>
            <S.P>아이디</S.P>
            <S.Input
              placeholder="아이디를 입력하세요"
              name="email"
              onChange={handleForm}
            ></S.Input>

            <img
              src="/images/email.png"
              style={{
                position: "absolute",
                width: "1.6vw",
                height: "3vh",
                marginTop: "64px",
                marginLeft: "10px",
              }}
              alt=""
            ></img>
          </S.InputBoxWrap>

          <S.InputBoxWrap>
            <S.P>비밀번호</S.P>
            <S.Input
              placeholder="비밀번호를 입력하세요"
              name="password"
              onChange={handleForm}
              type={inputType}
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
            <img
              src={imgUrl}
              alt=""
              style={{
                position: "absolute",
                width: "1.6vw",
                height: "3vh",
                marginTop: "66px",
                marginLeft: "28vw",
              }}
              onClick={toggleInputType}
            ></img>
          </S.InputBoxWrap>

          <S.InputBoxWrap>
            <S.SubmitButton onClick={onSubmit}>로그인</S.SubmitButton>
            <S.P>
              {" "}
              계정이 없다면?{" "}
              <Link to="/Signup" style={{ color: "rgba(88, 192, 154, 1)" }}>
                회원가입
              </Link>
            </S.P>
          </S.InputBoxWrap>
        </S.LoginBox>
      </S.LoginBoxWrap>
    </S.Wrap>
  );
};

export default Login;
