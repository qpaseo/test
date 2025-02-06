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

export const Div = styled.div`
  margin-top: 5vw;
  width: 728px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
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
