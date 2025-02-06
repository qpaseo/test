import React, { useState } from "react";
import * as S from "./style.js";
import axios from "axios";
import { useNavigate , useParams} from "react-router-dom";

const Edit = () => {

  const [equipmentName, setEquipmentName] =useState('');
  const [total, setTotal] = useState(0);
  const [possession, setPossession] = useState(0);
  const [empty, setEmpty] = useState(false);

  const accessToken = localStorage.getItem('ACCESS_TOKEN');
  const refreshToken = localStorage.getItem('REFRESH_TOKEN');

  const nav = useNavigate();
  const {id} = useParams();

  const getAccessToken = async() => {
    try{
      const res = await axios.post('http://98.82.78.128/auth/refresh',{
        refreshToken: refreshToken
      },{
        headers:{
          Authorization: `Bearer ${refreshToken}`
        }
      }) 
      if (res.status === 200){
        localStorage.removeItem('ACCESSTOKEN');
        localStorage.setItem('ACCESSTOKEN',res.data.accessToken);
      }
    } catch (error) {
      alert('다시 로그인하시오.')
      nav('/login');
    }
  };

  const editEquipment = async() => {
    try {
      const res = await axios.patch(`http://98.82.78.128/mains/patch/${id}`,{
        equipName: equipmentName,
        allNumber:total,
        number:possession
      },{
        headers:{
          Authorization: `Bearer ${accessToken}`
        }
      })
      if(res.status === 200 && empty){
        alert('수정되었습니다.');
        nav('/main');
      }
      
    } catch (error) {
      if (error.response && error.response.status === 401){
        await getAccessToken();
      } else {
        console.log(error);
        alert('수정에 실패하였습니다.');
      }
    }};

  const deleteEquipment = async() => {
    try {
      const res = await axios.delete(`http://98.82.78.128/mains/delete/${id}`)
      if (res.status === 200){
        alert('삭제성공');
        nav('/main');
      }
    } catch (error) {
      if (error.response && error.response.status === 401){
        await getAccessToken();
      } else {
        console.log(error);
        alert('수정에 실패하였습니다.');
      }
    }};

  const is_empty = () => {
    if (equipmentName !== '' && total > 0 && possession > 0){
      setEmpty(true);
    }
  }


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
      <S.SubmitButtonBox>
        <S.SubmitButton onClick={editEquipment}>기자재 수정</S.SubmitButton>
        <S.SubmitButton style={{backgroundColor:'#E94242'}} onClick={deleteEquipment}>기자재 삭제</S.SubmitButton>
      </S.SubmitButtonBox>
      
    </S.Mainbox>
  )};

export default Edit;

