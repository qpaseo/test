import styled from "styled-components";

export const MainStructure = styled.div`
  padding: 0;
  margin: 0;
  width: 100vw;
  height: 100vh;
  display: flex;
`;

export const EditScreen = styled.div`
  width: calc(100% - 224px);
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const ContentBox = styled.div`
  width: 768px;
  height: 576px;
`;

export const Header = styled.div`
  width: 768px;
  height: 64px;
  border-bottom: 1px solid #dbdbdb;
  display: flex;
  align-items: flex-start;
  margin-bottom: 32px;
`;

export const Title = styled.h1`
  font-size: 32px;
  font-weight: 600;
`;
