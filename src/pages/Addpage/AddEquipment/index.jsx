import React, { useState } from "react";
import * as S from "./AddEquipmentStyle.js";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Add = () => {
  const [equipmentName, setEquipmentName] = useState("");
  const [total, setTotal] = useState(0);
  const [possession, setPossession] = useState(0);
  const [empty, setEmpty] = useState(false);

  const nav = useNavigate();

  const accessToken = localStorage.getItem("ACCESS_TOKEN");
  const refreshToken = localStorage.getItem("REFRESH_TOKEN");

  const is_empty = () => {
    if (equipmentName !== "" && total !== 0 && possession !== 0) {
      setEmpty(true);
    }
  };

  const getAccessToken = async () => {
    try {
      const res = await axios.post(
        "http://98.82.78.128/auth/refresh",
        {
          refreshToken: refreshToken,
        },
        {
          headers: {
            Authorization: `Bearer ${refreshToken}`,
          },
        }
      );
      if (res.status === 200) {
        localStorage.removeItem("ACCESSTOKEN");
        localStorage.setItem("ACCESSTOKEN", res.data.accessToken);
      }
    } catch (error) {
      alert("다시 로그인하시오.");
      nav("/login");
    }
  };

  const addEquipment = async () => {
    try {
      const res = await axios.post(
        "http://98.82.78.128/mains/post",
        {
          equipName: equipmentName,
          allNumber: total,
          number: possession,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      if (res.status === 200 && empty) {
        alert("추가되었습니다.");
        nav("/main");
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        await getAccessToken();
      } else {
        alert("추가하지 못했습니다.");
        console.log(error);
      }
    }
  };

  return (
    <S.Mainbox>
      <S.EditScreen>
        <S.EquipmentPhoto />
        <S.InputPlace>
          <S.InputBox>
            <S.ExplainTitle>기자재명</S.ExplainTitle>
            <S.EquipmentInput
              onChange={(e) => {
                setEquipmentName(e.target.value);
                is_empty();
              }}
            />
          </S.InputBox>

          <S.InputBox>
            <S.ExplainTitle>전체 개수</S.ExplainTitle>
            <S.EquipmentInput
              type="number"
              min={1}
              onChange={(e) => {
                setTotal(e.target.value);
                is_empty();
              }}
            />
          </S.InputBox>

          <S.InputBox>
            <S.ExplainTitle>보유 개수</S.ExplainTitle>
            <S.EquipmentInput
              type="number"
              min={1}
              onChange={(e) => {
                setPossession(e.target.value);
                is_empty();
              }}
            />
          </S.InputBox>
        </S.InputPlace>
      </S.EditScreen>
      <S.SubmitButton onClick={addEquipment}>기자재 추가</S.SubmitButton>
    </S.Mainbox>
  );
};

export default Add;
