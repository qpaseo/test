import React, { useEffect, useRef } from "react";
import useStore from "../zustand/store";

function Main() { 
  const { color } = useStore();
  const mainDivRef = useRef();

  console.log(color);

  useEffect(() => {
    if (mainDivRef.current) {
      mainDivRef.current.style.backgroundColor = localStorage.getItem("color");
    }
  }, [color]);

  return (
    <div
      ref={mainDivRef}
      style={{
        height: "100vw",
        width: "100vw",
      }}
    ></div>
  );
}

export default Main;
