import styled from "styled-components";

export const Container = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
  background-color: #f6f6f6;
`;

export const MainContainer = styled.div`
  width: calc(100% - 242px);
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const SchoolName = styled.div`
  font-size: 36px;
  font-weight: 600;
`;

export const SubmitButton = styled.div`
  width: 122px;
  height: 47px;
  color: white;
  border-radius: 30px;
  font-weight: 400;
  background-color: black;
  font-size: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
`;

export const Div = styled.div`
  margin-top: 5vw;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

export const TopNav = styled.div`
  width: 100%;
  height: 47px;
  margin-bottom: 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const EquipmentDiv = styled.div`
  margin-top: 48px;
  width: 80%;
  max-width: 80%;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 4vw;
  align-items: center;
  justify-items: center;
`;
