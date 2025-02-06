import styled from "styled-components";

export const Mainbox = styled.div`
  width: 768px;
  height: 466px;
  display: flex;
  align-items: center;
  flex-direction: column;
`;
export const EquipmentPhoto = styled.div`
  margin-top: 12px;
  width: 328px;
  height: 320px;
  background-color: #d9d9d9;
  border-radius: 32px;
`;

export const EquipmentInput = styled.input`
  width: 316px;
  height: 56px;
  border: 1px solid #ededed;
  border-radius: 16px;
  background-color: white;
  font-size: 14px;
  padding-left:20px;
`;

export const ExplainTitle = styled.p`
  color:#888888;
  font-size:14px;
  font-weight:400px;
  margin-bottom: 12px;
`

export const InputPlace = styled.div`
  width: 316px;
  height: 320px;
  display: flex;
  flex-direction: column;
  gap:32px;
  margin-top: 12px;
`;

export const InputBox = styled.div`
  width: 316px;
  height:100px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  
`

export const EditScreen = styled.div`
  width: 768px;
  display: flex;
  justify-content: space-between;
`;

export const SubmitButton = styled.button`
  width: 138px;
  height: 48px;
  background-color:black;
  border: none;
  font-size: 16px;
  color:white;
  border-radius:50px;
  margin-top:70px;
`;

export const SubmitButtonBox = styled.div`
  width:316px;
  height:48px;
  display: flex;
  justify-content: space-between;
`