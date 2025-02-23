import React, { useRef, useEffect } from "react";
import useStore from "../zustand/store";

function Profile() {
  const { color, setColor } = useStore();

  const red_button = useRef(null);
  const yellow_button = useRef(null);
  const green_button = useRef(null);
  const blue_button = useRef(null);

  useEffect(() => {
    const buttons = {
      red: red_button.current,
      yellow: yellow_button.current,
      green: green_button.current,
      blue: blue_button.current,
    };

    Object.values(buttons).forEach((button) => {
      if (button) {
        button.style.backgroundColor = "";
      }
    });

    if (buttons[color]) {
      buttons[color].style.backgroundColor = color;
    }
  }, [color]);

  return (
    <div>
      <button ref={red_button} onClick={() => setColor("red")}>
        R
      </button>
      <button ref={yellow_button} onClick={() => setColor("yellow")}>
        Y
      </button>
      <button ref={green_button} onClick={() => setColor("green")}>
        G
      </button>
      <button ref={blue_button} onClick={() => setColor("blue")}>
        B
      </button>
    </div>
  );
}

export default Profile;
