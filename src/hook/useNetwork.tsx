//네트워크 변화 감지

import { useEffect, useState } from "react";

const useNetwork = (onChange: Function) => {
  const [status, setStatus] = useState(navigator.onLine);
  const handleChange = () => {
    onChange(navigator.onLine);
    setStatus(navigator.onLine);
  };
  useEffect(() => {
    window.addEventListener("online", handleChange);
    window.addEventListener("offline", handleChange);
    return () => {
      window.removeEventListener("online", handleChange);
      window.removeEventListener("offline", handleChange);
    };
  }, []);
  return status;
};

export const UseNetwork = () => {
  const handleNetworkChange = (online: boolean) => {
    console.log(online);
  };
  const online = useNetwork(handleNetworkChange);
  return (
    <div>
      <h1>{online ? "Online" : "Offline"}</h1>
    </div>
  );
};
