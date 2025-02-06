import styled from "styled-components";

// 전체 화면 스타일
export const All = styled.div`
    padding: 0;
    margin: 0;
    display: flex;
    background-color: #F6F6F6;
    flex-wrap: wrap;
`;

// Tt 스타일: Title과 Line 제외한 부분 가로 나열
export const Tt = styled.div`
    display: flex;
    flex-direction: column;
    gap: 20px;
    align-items: start;
    margin-top: 80px;
    margin-left: 180px;

`;
//제목
export const Title = styled.h2`
    display: flex;
    flex-direction: column;
    font-weight: 455;
    font-size: 32px;
`;

// 구분선
export const Line = styled.hr`
    width: 984px;
    height: 1px;
    border: none;
    background: #d2d2d2;
    margin-top: -5px;
`;
//박스, 기자재 이름, 날짜, 확인여부를 묶어놓음
export const Container = styled.div`
width: 164px;
 display: flex;
 justify-content: center;
 align-items: center;
 flex-direction: column;
 margin-top: 20px;
 
`

// 기자재 박스
export const Box = styled.div`
    display: flex;
    width: 164px;
    height: 200px;
    background-color: white;
    border-radius: 25px;
    justify-content: center;
    align-items: center;
`;

// 기자재 이름 Container
export const Equipment = styled.span`
    display: flex;
    display-direction: row;
    font-size: 16px;
    margin-top: 20px;
`;

// 로고이미지
export const Image = styled.img`
    width: 68px;
    height: 22px;
    display: flex;
`;
export const Date = styled.div`
    font-size:12px;
    width: 164px;
    display: flex;
    justify-content: center;
    gap: 8px;

`
// ~ 모양
export const string = styled.span`
    font-size: 10px;
    margin-top: 8px;
    color: #888888;
`
//끝나는 날짜
export const EndDate = styled.div`
  font-size: 10px;
    margin-top: 8px;
    color: #888888;
`

// 선생님 확인여부
export const Check = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    width: 83px;
    height: 26px;
    border-radius: 20px;
    background-color: black;
    color: white;
    font-size: 12px;
    margin-top: 15px;
`;

// 두 번째 확인 여부 스타일
export const Check2 = styled(Check)`
    background-color: #E94242;
    width: 60px;
`;

export const Check3 = styled(Check)`
    background-color: #58C09A;
    width: 60px;
    height: 25px
`;

export const Check4 = styled(Check)`
    background-color: #888888;
    width: 60px;
`;


export const Wrapper = styled.div`
 width: 970px; 
 display: flex;
 flex-direction: row;
  gap:32px;
  flex-wrap: wrap;
`