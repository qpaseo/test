import styled from "styled-components";

export const Box = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const TopNav = styled(Box)`
  width: 100%;
  height: 47px;
  margin-bottom: 24px;
  justify-content: space-between;
`;

export const SchoolName = styled.div`
  font-size: 36px;
  font-weight: 600;
`;

export const SubmitButton = styled(Box)`
  width: 122px;
  height: 47px;
  color: white;
  border-radius: 30px;
  font-weight: 400;
  background-color: black;
  font-size: 16px;
  justify-content: center;
  cursor: pointer;
`;
