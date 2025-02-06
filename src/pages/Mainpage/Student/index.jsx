import React, { useEffect, useState } from "react";
import * as S from "./indexStyle";
import EquipmentContainer from "../EquipmentContainer/index";
import SideBar from "../../../components/Sidebar/index";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Header from "../elements/Header/index";

const StudentMain = () => {
  const [equips, setEquips] = useState([]);
  const ACCESS_TOKEN = localStorage.getItem("ACCESS_TOKEN");
  const navigate = useNavigate();
  const getEquip = async () => {
    try {
      const res = await axios.get("http://98.82.78.12/mains/get", {
        headers: { Authorization: `Bearer ${ACCESS_TOKEN}` },
      });
      if (res) {
        setEquips(res.data);
        console.log(res.data);
      }
    } catch (e) {
      console.log(`안녕${e}`);
    }
  };

  useEffect(() => {
    getEquip();
  }, []);

  return (
    <S.Container>
      <SideBar />
      <S.MainContainer>
        <S.Div>
          <div style={{ width: "728px", height: "47px" }}>
            <Header
              title="대구소프트웨어마이스터고"
              button="기타물건 신청"
              link="applyremainder"
            />
            <S.EquipmentDiv>
              <EquipmentContainer />
              {equips.map((equip) => (
                <EquipmentContainer
                  key={equip.id}
                  id={equip.id}
                  number={equip.number}
                  allNumber={equip.allNumber}
                  equipName={equip.equipName}
                />
              ))}
            </S.EquipmentDiv>
          </div>
        </S.Div>
      </S.MainContainer>
    </S.Container>
  );
};

export default StudentMain;
