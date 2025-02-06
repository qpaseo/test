import React from "react";
import * as A from "./RentalStyle";
import Sidebar from "../../components/Sidebar/index";
const Rental = () => {
  return (
    <A.All>
      <Sidebar />
      <A.Tt>
        <A.Title>대여현황</A.Title>
        <A.Line />
        <A.Wrapper>
          <A.Container>
            <A.Box>
              <A.Image src="images/Applysituation.png" />
            </A.Box>
            <A.Equipment>아두이노(3개)</A.Equipment>
            <A.Date>2024 .11 .10 ~ 2024 .11 .20</A.Date>
            <A.Check>신청승인중</A.Check>
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
            <A.Checkbox>
              <A.Check3>승인됨</A.Check3>
              <A.Check2>반납확인</A.Check2>
            </A.Checkbox>
          </A.Container>
          <A.Container>
            <A.Box>
              <A.Image src="images/Applysituation.png" />
            </A.Box>
            <A.Equipment>아두이노(3개)</A.Equipment>
            <A.Date>2024 .11 .10 ~ 2024 .11 .20</A.Date>
            <A.Checkbox>
              <A.Check4>반납완료</A.Check4>
            </A.Checkbox>
          </A.Container>
        </A.Wrapper>
      </A.Tt>
    </A.All>
  );
};

export default Rental;
