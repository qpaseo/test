import React from "react";
import SideBar from "../../components/Sidebar/index";
import Edit from "./EditEquipment/index.jsx";
import * as S from "./indexStyle.js";

const EditPage = () => {
  return (
    <S.MainStructure>
      <SideBar />
      <S.EditScreen>
        <S.ContentBox>
          <S.Header>
            <S.Title>수정하기</S.Title>
          </S.Header>
          <Edit />
        </S.ContentBox>
      </S.EditScreen>
    </S.MainStructure>
  );
};

export default EditPage;
