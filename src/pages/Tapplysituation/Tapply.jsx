import React from "react";
import * as A from "./TapplyStyle";
import Sidebar from "../../components/Sidebar/index";
const Tapply = () => {
  return (
    <A.All>
      <Sidebar />
      <A.Tt>
        <A.Ttbox>
          <A.Title>신청현황</A.Title>
          <A.excel>엑셀 다운로드</A.excel>
        </A.Ttbox>
        <A.Line />
        <A.Wrapper>
          <A.Container>
            <A.Box>
              <A.Image src="images/Applysituation.png" />
            </A.Box>
            <A.Equipment>아두이노(3개)</A.Equipment>
            <A.Date>2024 .11 .10 ~ 2024 .11 .20</A.Date>
            <A.Checkbox>
              <A.Check3>수락</A.Check3>
              <A.Check2>거절</A.Check2>
            </A.Checkbox>
          </A.Container>
          <A.Container>
            <A.Box>
              <A.Image src="images/Applysituation.png" />
            </A.Box>
            <A.Equipment>아두이노(3개)</A.Equipment>
            <A.Date>2024 .11 .10 ~ 2024 .11 .20</A.Date>
            <A.Check2>거절됨</A.Check2>
          </A.Container>
          <A.Container>
            <A.Box>
              <A.Image src="images/Applysituation.png" />
            </A.Box>
            <A.Equipment>아두이노(3개)</A.Equipment>
            <A.Date>2024 .11 .10 ~ 2024 .11 .20</A.Date>
            <A.Check3>승인됨</A.Check3>
          </A.Container>
        </A.Wrapper>
      </A.Tt>
    </A.All>
  );
};

export default Tapply;
