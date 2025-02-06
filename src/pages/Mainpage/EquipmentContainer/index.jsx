import React, { useState } from "react";
import * as S from "./indexStyle";
import { useNavigate } from "react-router-dom";
const EquipmentContainer = ({ id, number, allNumber, equipName }) => {
  const navigate = useNavigate();
  return (
    <S.MainContainer>
      <S.EquipContainer>
        <img src="/images/EmptyLogo.svg" />
      </S.EquipContainer>
      <S.EquipInfo>
        <S.Title>{equipName}</S.Title>
        <S.RemainingCount>
          {number}/{allNumber}
        </S.RemainingCount>
        <S.EditButton onClick={() => navigate(`/edit:${id}`)}>
          수정하기
        </S.EditButton>
      </S.EquipInfo>
    </S.MainContainer>
  );
};
export default EquipmentContainer;
