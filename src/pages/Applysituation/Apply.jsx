import axios from "axios";
import React, { useState, useEffect } from "react";
import * as A from "./ApplyStyle";
import Sidebar from "../../components/Sidebar/index";

const token =
  "eyJKV1QiOiJBQ0NFU1MiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJzdHJpbmdAZW1haWwuY29tIiwicm9sZSI6IlJPTEVfU1RVREVOVCIsImlhdCI6MTczMDk3NTEzNSwiZXhwIjoxODE3Mzc1MTM1fQ.C2Yhym53pq2UMvKf7-MwlbydUloz7_kqe4HLDNF2TE8";

const Apply = () => {
  const [apply, setApply] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "http://98.82.78.128/student/myRequests",
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log(response);
      } catch (error) {
        console.log("데이터를 가져오는 중 오류 발생: ", error);
      }
    };

    fetchData(); // async 함수 호출
  }, []);

  return (
    <A.All>
      <Sidebar />
      <A.Tt>
        <A.Title>신청현황</A.Title>
        <A.Line />
        <A.Wrapper>
          <A.Container>
            <A.Box>
              <A.Image src="/images/Applysituation.png" />
            </A.Box>
            <A.Equipment>아두이노(3개)</A.Equipment>
            <A.Date>2024 .11 .10 ~ 2024 .11 .20</A.Date>
            <A.Check>신청승인중</A.Check>
          </A.Container>
          <A.Container>
            <A.Box>
              <A.Image src="/images/Applysituation.png" />
            </A.Box>
            <A.Equipment>아두이노(3개)</A.Equipment>
            <A.Date>2024 .11 .10 ~ 2024 .11 .20</A.Date>
            <A.Check2>거절됨</A.Check2>
          </A.Container>
          <A.Container>
            <A.Box>
              <A.Image src="/images/Applysituation.png" />
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

export default Apply;
