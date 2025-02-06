import React from "react";
import SideBar from "../../components/Sidebar/index.jsx";
import Add from "./AddEquipment/index.jsx";
import * as S from "./indexStyle.js";

const AddPage = () => {
  return (
    <S.MainStructure>
      <SideBar />
      <S.EditScreen>
        <S.ContentBox>
          <S.Header>
            <S.Title>추가하기</S.Title>
          </S.Header>
          <Add />
        </S.ContentBox>
      </S.EditScreen>
    </S.MainStructure>
  );
};

export default AddPage;
