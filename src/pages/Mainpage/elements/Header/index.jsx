import React from "react";
import * as S from "./indexStyle";
import { useNavigate } from "react-router-dom";

const Header = ({ title, button, link }) => {
  const navigate = useNavigate();
  return (
    <>
      <S.TopNav>
        <S.SchoolName>{title}</S.SchoolName>
        <S.SubmitButton onClick={() => navigate(`/${link}`)}>
          {button}
        </S.SubmitButton>
      </S.TopNav>
      <hr style={{ width: "100%", border: "1px solid #DBDBDB" }} />
    </>
  );
};

export default Header;
