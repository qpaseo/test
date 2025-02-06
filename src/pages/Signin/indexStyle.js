import styled from "styled-components";

export const P = styled.p`
  color: rgba(136, 136, 136, 1);
`;

export const Wrap = styled.div`
  display: flex;
  flex-direction: row;
  width: 100vw;
  height: 100vh;
  justify-content: center;
`;

export const LogoBox = styled.div`
  width: 50vw;
  height: 100vh;
  background-image: url("/images/logo.png");
  background-size: 50vw 100vh;
`;
export const LoginBoxWrap = styled.div`
  display: flex;
  align-items: center;
  width: 50vw;
  height: 100vh;
  justify-content: center;
`;
export const LoginBox = styled.div`
  display: flex;
  flex-direction: column;
  width: 30vw;
  height: 60vh;
`;
export const InputBoxWrap = styled.div`
  display: flex;
  flex-direction: column;
  width: 28vw;
  height: 17vh;
`;
export const Input = styled.input`
  width: 27.5vw;
  height: 6.5vh;
  border-radius: 16px;
  border: none;
  box-shadow: 0px 0px 3px 2.5px rgba(237, 237, 237, 1);
  padding-left: 45px;
`;
export const SubmitButton = styled.button`
  display: flex;
  width: 31vw;
  height: 10vh;
  border-radius: 16px;
  border: 1px rgba(88, 192, 154, 1);
  background-color: rgba(88, 192, 154, 1);
  margin-top: 30px;
  color: white;
  justify-content: center;
  align-items: center;
`;
