import styled from "styled-components";

export const MainContainer = styled.div`
  width: 164px;
  height: 304px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-around;
`;

export const EquipContainer = styled.div`
  background-color: #ffffff;
  width: 164px;
  height: 200px;
  border-radius: 32px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const EquipInfo = styled.div`
  width: 70px;
  height: 84px;
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: space-between;
`;

export const Title = styled.div`
  font-size: 20px;
`;

export const RemainingCount = styled.div`
  font-size: 12px;
  color: #888888;
`;

export const EditButton = styled.div`
  width: 70px;
  height: 26px;
  font-size: 12px;
  cursor: pointer;
  border-radius: 30px;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #58c09a;
`;
