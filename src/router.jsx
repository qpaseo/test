import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./Login";
import StudentMain from "./Mainpage/Student";
import TeacherMain from "./Mainpage/Teacher";

const Router = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />}></Route>
        <Route path="/studentmain" element={<StudentMain />}></Route>
        <Route path="/teachermain" element={<TeacherMain />}></Route>
      </Routes>
    </BrowserRouter>
  );
};

export default Router;
