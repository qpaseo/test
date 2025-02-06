import React from "react";
import * as S from "./indexStyle";
import Logo from "./logo.svg";
import Submit from "./submit.svg";
import Borrow from "./borrow.svg";
import { useNavigate } from "react-router-dom";

const Sidebar = () => {
  const navigate = useNavigate();
  return (
    <S.Bar>
      <S.Contents>
        <S.Logo>
          <img
            src={Logo}
            onClick={() => navigate("/main")}
            style={{ cursor: "pointer" }}
          />
        </S.Logo>
        <S.NavFunc>
          <S.Title>내 현황</S.Title>
          <S.NavText onClick={() => navigate("/rentalsituation")}>
            <S.Icon src={Submit} />
            <span style={{ color: "white" }}>신청현황</span>
          </S.NavText>
          <S.NavText onClick={() => navigate("/trentalsituation")}>
            <S.Icon src={Borrow} />
            <span style={{ color: "white" }}>대여현황</span>
          </S.NavText>
        </S.NavFunc>
      </S.Contents>
    </S.Bar>
  );
};

export default Sidebar;
