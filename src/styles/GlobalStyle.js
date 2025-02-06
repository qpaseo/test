import { createGlobalStyle } from "styled-components";

const GlobalStyle = createGlobalStyle`
@import url("https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable.min.css");

body,
html {
  margin: 0;
  font-family: "Pretendard", sans-serif;
}
`;

export default GlobalStyle;
