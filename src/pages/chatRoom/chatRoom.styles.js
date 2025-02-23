import styled from "styled-components";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 94vh;
  padding: 20px;
  background-color: #f1f1f1;
`;

const MessagesWrapper = styled.div`
  flex: 1;
  overflow-y: auto;
  margin-bottom: 10px;
  display: flex;
  flex-direction: column;
`;

const MessageBox = styled.div`
  padding: 10px;
  margin-bottom: 10px;
  border-radius: 10px;
  width: 24vw;
  max-width: 30vw;
  background-color: ${({ $isMine }) => ($isMine ? "#007bff" : "#e0e0e0")};
  color: ${({ $isMine }) => ($isMine ? "white" : "black")};
  align-self: ${({ $isMine }) => ($isMine ? "flex-end" : "flex-start")};
`;

const InputWrapper = styled.div`
  display: flex;
  align-items: center;
  margin-top: 10px;
`;

const Input = styled.input`
  flex: 1;
  padding: 10px;
  border-radius: 20px;
  border: 1px solid #ccc;
`;

const Button = styled.button`
  padding: 10px 20px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 20px;
  margin-left: 10px;
  cursor: pointer;

  &:hover {
    background-color: #0056b3;
  }
`;

export default {
  Container,
  MessagesWrapper,
  MessageBox,
  InputWrapper,
  Input,
  Button,
};
