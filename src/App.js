import "./App.css";
import React from "react";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import Signin from "./pages/Signin/index";
import Signup from "./pages/Signup/index";
import Addpage from "./pages/Addpage/index";
import Editpage from "./pages/Editpage/index";
import Apply from "./pages/Apply/index";
import ApplyRemainder from "./pages/ApplyRemainder/index";
import Applysituation from "./pages/Applysituation/Apply";
import StudentMainPage from "./pages/Mainpage/Student/index";
import TeacherMainPage from "./pages/Mainpage/Teacher/index";
import Rentalsituation from "./pages/Rentalsituation/Rental";
import Tapplysituation from "./pages/Tapplysituation/Tapply";
import Trentalsituation from "./pages/Trentalsituation/Trental";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/signin" />} />
        <Route path="/signin" element={<Signin />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/addpage" element={<Addpage />} />
        <Route path="/editpage" element={<Editpage />} />
        <Route path="/apply" element={<Apply />} />
        <Route path="/applyRemainder" element={<ApplyRemainder />} />
        <Route path="/applysituation" element={<Applysituation />} />
        <Route path="/studentMainPage" element={<StudentMainPage />} />
        <Route path="/teacherMainPage" element={<TeacherMainPage />} />
        <Route path="/rentalsituation" element={<Rentalsituation />} />
        <Route path="/tapplysituation" element={<Tapplysituation />} />
        <Route path="/trentalsituation" element={<Trentalsituation />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
