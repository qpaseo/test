import { useState, useEffect } from "react";
import { supabase } from "../../db/supabase";
import S from "./chatRoom.styles"; // ✅ S 객체로 스타일 가져오기

export const ChatRoom = () => {
  const roomNumber = localStorage.getItem("roomNumber"); // 사용자가 입력한 방 번호
  const storedUserId = localStorage.getItem("userId"); // Home 페이지에서 저장한 사용자 ID
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");

  // 메시지 불러오기 및 실시간 업데이트
  useEffect(() => {
    const fetchMessages = async () => {
      const { data } = await supabase
        .from("messages")
        .select("*")
        .eq("room", roomNumber)
        .order("created_at", { ascending: true });

      setMessages(data || []);
    };

    fetchMessages();

    // 실시간 메시지 감지
    const subscription = supabase
      .channel(`realtime:messages:${roomNumber}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `room=eq.${roomNumber}`,
        },
        (payload) => {
          setMessages((prev) => [...prev, payload.new]);
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [roomNumber]);

  // 메시지 전송
  const sendMessage = async () => {
    if (!message.trim()) return;

    const { data, error } = await supabase
      .from("messages")
      .insert([{ content: message, room: roomNumber, user_id: storedUserId }]);

    if (error) {
      console.error("Error inserting message:", error.message);
      alert("메시지 전송 실패: " + error.message);
    } else {
      setMessage(""); // 메시지 전송 후 입력창 초기화
    }
  };

  return (
    <S.Container>
      {/* 채팅 메시지 목록 */}
      <S.MessagesWrapper>
        {messages.map((msg, index) => (
          <S.MessageBox key={index} $isMine={msg.user_id === storedUserId}>
            {msg.content}
          </S.MessageBox>
        ))}
      </S.MessagesWrapper>

      {/* 입력창 */}
      <S.InputWrapper>
        <S.Input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && message.trim()) {
              sendMessage();
            }
          }}
          placeholder="메시지를 입력하세요..."
        />
        <S.Button onClick={sendMessage}>전송</S.Button>
      </S.InputWrapper>
    </S.Container>
  );
};
