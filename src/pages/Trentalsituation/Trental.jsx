import Sidebar from "../../components/Sidebar/index";
import * as A from "./TrentalStyle";
import React from "react";

const Trental = () => {
  return (
    <A.All>
      <Sidebar />
      <A.Tt>
        <A.Ttbox>
          <A.Title>대여현황</A.Title>
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
              <A.Check2>기한초과</A.Check2>
              <A.Check3>반납확인</A.Check3>
            </A.Checkbox>
          </A.Container>
          <A.Container>
            <A.Box>
              <A.Image src="images/Applysituation.png" />
            </A.Box>
            <A.Equipment>아두이노(3개)</A.Equipment>
            <A.Date>2024 .11 .10 ~ 2024 .11 .20</A.Date>
            <A.Check4>반납완료</A.Check4>
          </A.Container>
          <A.Container>
            <A.Box>
              <A.Image src="images/Applysituation.png" />
            </A.Box>
            <A.Equipment>아두이노(3개)</A.Equipment>
            <A.Date>2024 .11 .10 ~ 2024 .11 .20</A.Date>
            <A.Check3>반납확인</A.Check3>
          </A.Container>
        </A.Wrapper>
      </A.Tt>
    </A.All>
  );
};

export default Trental;
