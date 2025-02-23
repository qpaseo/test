import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";

import { Home } from "./pages/home/home";
import { ChatRoom } from "./pages/ChatRoom/chatRoom";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/home" />} />
        <Route path="/home" element={<Home />} />
        <Route path="/chatRoom/:roomNumber" element={<ChatRoom />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
