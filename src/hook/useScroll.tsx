//요소가 스크롤에 없으면 함수 실행

import React, { useEffect, useState } from "react";

const useScroll = () => {
  const [state, steState] = useState({
    x: 0,
    y: 0,
  });
  const onScroll = () => {
    console.log("y", window.scrollY, "x", window.scrollX);
    steState({ y: window.scrollY, x: window.scrollX });
  };
  useEffect(() => {
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  });
  return state;
};

export const UseScroll = () => {
  const { y } = useScroll();
  return (
    <div style={{ height: "1000vh" }}>
      <h1 style={{ color: y > 100 ? "red" : "blue", marginTop: "400px" }}>
        hello
      </h1>
    </div>
  );
};
