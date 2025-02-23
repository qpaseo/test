import React, { useState } from "react";
import ReactDOM from "react-dom/client";
import useStore from "../zustand/store";

function Counter() {
  const { Count, Plus, Minus } = useStore();

  return (
    <div>
      <button onClick={Plus}>
        +
      </button>
      <span>{Count}</span>
      <button
        onClick={Minus}
      >
        -
      </button>
    </div>
  );
}

export default Counter;
