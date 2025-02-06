import React, { useState } from "react";
import Sidebar from "../../components/Sidebar/index";
import * as S from "./indexStyle";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ApplyRemainder = () => {
  const navigate = useNavigate();
  const [applyData, setApplyData] = useState({
    equipname:'',
    number:'',
    startDate:'',
    endDate:'',
    reason:''
  });

  const handleForm = (e) => { // ApplyData에 입력된 값을 저장
    const {name,value} = e.target;
    setApplyData( (prev) => ({...prev,[name]:value}));
  }

  const RefreshToken = async () => { // 리프레쉬 토큰으로 엑세스토큰 재발급 받음.
    const refreshToken = localStorage.getItem('REFRESH_TOKEN'); 
    if (!refreshToken) { // 토큰이 없을 때
        alert('로그인이 필요합니다.');
        return;
    }

    try {
      const res = await axios.get('http://98.82.78.128/auth/refresh',{
        headers: { Authorization: `Bearer ${refreshToken}` } 
    });

        if (res.data.accessToken) { //엑세스 토큰이 존재한다면
            const newAccessToken = res.data.accessToken;
            localStorage.setItem('ACCESS_TOKEN', newAccessToken);
            alert('엑세스 토큰을 재발급 했습니다.');
        }
    } catch (error) {
        console.error('토큰 갱신 실패:', error.response ? error.response.data : error);
        alert('토큰 갱신 실패 로그인이 필요합니다.');
        return 
    }
};


const Authorization = async () => { // 엑세스 토큰 유무 파악 후 반환
  let token = localStorage.getItem('ACCESS_TOKEN');
  if (token === 'undefind' || token === null) {
      await RefreshToken();
      token = localStorage.getItem('ACCESS_TOKEN'); // token변수에 새롭게 저장된 토큰을 넣음.
  }

  if (token) {
      return '인증성공';
  } else {
      return '인증실패';
  }
};

const onSubmit = async () => { //서버에 기자재 정보를 보내는 함수
  const authorization = await Authorization();
  const token = localStorage.getItem('ACCESS_TOKEN');

  if(applyData.equipname !=='' && applyData.number !== ''&& applyData.startDate !=='' && applyData.endDate !== '' && applyData.reason !== ''){
    if (authorization === '인증성공' && token !== 'undefind') {
      try {
          const res = await axios.post('http://98.82.78.128/student/request', {
              equipName: applyData.equipname,
              number: parseInt(applyData.number),
              startDate: applyData.startDate,
              endDate: applyData.endDate,
              reason: applyData.reason
          }, {
              headers: { Authorization: `Bearer ${token}` }
          });

          if (res) {
              alert('신청완료');
              navigate('/Main');
              return 
          }
      } catch (err) {
          console.log(err);
          alert('네트워크 에러');
      }
  } else {
      console.log('인증실패');
  }
  } else{
    alert('값을 모두 입력해주세요');
  }
};

  return (
    <S.MainWrap>
      <Sidebar  />
      <S.Container>
        <S.H1>신청하기(기타 신청)</S.H1>
        <S.Hr></S.Hr>

        <S.ApplyWrap>
          <S.InputBox>
            <S.InputWrap>
                <S.P>물품명</S.P>
                <S.Input name='equipname' onChange={handleForm}></S.Input>
            </S.InputWrap>

            <S.InputWrap2>
              <S.P>사유</S.P>
              <S.TextArea name='reason' onChange={handleForm}></S.TextArea>
            </S.InputWrap2>
          </S.InputBox>

          <S.InputBox>
            <S.InputWrap>
                  <S.P>개수</S.P>
                  <S.Input type="number" name='number' onChange={handleForm} min='0'></S.Input>
              </S.InputWrap>
              
              <S.InputWrap>
                  <S.P>신청 일자</S.P>
                  <S.InputDate name='startDate' onChange={handleForm} type="date"></S.InputDate>
              </S.InputWrap>

              <S.InputWrap>
                  <S.P>반납 일자</S.P>
                  <S.InputDate name='endDate' onChange={handleForm} type="date" ></S.InputDate>
              </S.InputWrap>
            </S.InputBox>
        </S.ApplyWrap>
        <S.SubmitButton onClick={onSubmit}>신청하기</S.SubmitButton>

      </S.Container>
    </S.MainWrap>
  );
};

export default ApplyRemainder;
