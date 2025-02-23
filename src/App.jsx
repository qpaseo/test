import React from "react";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import Counter from "./pages/Counter";
import Main from "./pages/Main";
import Profile from "./pages/Profile";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/counter" />} />
        <Route path="/counter" element={<Counter />} />
        <Route path="/main" element={<Main />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
