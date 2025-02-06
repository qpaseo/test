import styled from "styled-components"

export const P = styled.p `
    color:rgba(136, 136, 136, 1);
`
export const MainWrap = styled.div   `
    display:flex;

`
export const Container = styled.div `
    display:flex;
    width: calc(100% - 242px);
    height:100vh;
    flex-direction:column;
`

export const WrapApplyBox = styled.div`
    border:1px solid;
    width:60vw;
    height:70vh;
`
export const H1 = styled.h1`
    font-weight:600;
    margin-top:100px;
    margin-left:170px;
`
export const Hr = styled.hr`
    width:63vw;
    margin-left:165px;
    margin-top:0;
`
export const ApplyWrap = styled.div`
    display:flex;
    flex-direction:row;
    justify-content:space-between;
    width:63vw;
    height:55vh;
    margin-left:165px;
`

export const InputBox = styled.div`
    width:30vw;
    height:55vh;
`
export const InputWrap = styled.div`
    width:30vw;
    height:15vh;
`
export const Input = styled.input`
    width: 29.5vw;
    height: 6.5vh;
    border-radius:16px;
    border:none;
    box-shadow:0px 0px 3px 2px rgba(237, 237, 237, 1);
`

export const InputWrap2 = styled.div`
    width:30vw;
    height:30vh;
    margin-top:20px;
`
export const TextArea = styled.textarea`
    width:29.5vw;
    height:23vh;
    border:none;
    box-shadow:0px 0px 3px 2px rgba(237, 237, 237, 1);
    border-radius:16px;
`
export const SubmitButton = styled.button`
    display:flex;
    justify-content:center;
    align-items:center;
    width:10vw;
    height:7vh;
    background-color:black;
    border-radius:100px;
    margin-left:560px;
    color:white;
`