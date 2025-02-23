import { useState } from "react";
import { useNavigate } from "react-router-dom";
import S from "./home.styles";
import { supabase } from "../../db/supabase";

export const Home = () => {
  const [roomNumber, setRoomNumber] = useState("");
  const navigate = useNavigate();

  const handleEnterRoom = async () => {
    if (!roomNumber.trim()) {
      return alert("방 번호를 입력하세요!");
    }
    // 방 번호를 로컬스토리지에 저장
    localStorage.setItem("roomNumber", roomNumber);

    let newUserId;
    // rooms 테이블에서 해당 roomNumber가 존재하는지 확인
    const { data: room, error } = await supabase
      .from("rooms")
      .select("*")
      .eq("room_id", roomNumber)
      .limit(1)
      .maybeSingle();

    if (error) {
      console.error("Error fetching room:", error.message);
      return;
    }

    if (room) {
      // 방이 존재하면 사람 수를 +1하고 업데이트
      newUserId = room.people_count + 1;
      const { error: updateError } = await supabase
        .from("rooms")
        .update({ people_count: newUserId })
        .eq("room_id", roomNumber);
      if (updateError) {
        console.error("Error updating room:", updateError.message);
        return;
      }
    } else {
      // 방이 없으면 새로운 방 생성, 첫 사용자 id는 1
      newUserId = 1;
      const { error: insertError } = await supabase
        .from("rooms")
        .insert([{ room_id: roomNumber, people_count: newUserId }]);
      if (insertError) {
        console.error("Error inserting room:", insertError.message);
        return;
      }
    }

    // 결정된 userId를 로컬스토리지에 저장
    localStorage.setItem("userId", newUserId);

    // 채팅방 페이지로 이동
    navigate(`/chatRoom/${roomNumber}`);
  };

  return (
    <S.Container>
      <S.Card>
        <S.Title>채팅방 입장</S.Title>
        <S.Input
          type="text"
          placeholder="방 번호 입력"
          value={roomNumber}
          onChange={(e) => setRoomNumber(e.target.value)}
        />
        <S.Button onClick={handleEnterRoom}>입장하기</S.Button>
      </S.Card>
    </S.Container>
  );
};
