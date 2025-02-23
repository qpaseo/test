import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";

//import { UseInput } from "./hook/useTabs";
//import { UseTabs } from "./hook/useTabs";
// import { UseTitle } from "./hook/useTitle";
// import { UseClick } from "./hook/useClick";
// import { UseConfirm } from "./hook/useConfirm";
// import { UsePreventLeave } from "./hook/usePreventLeave";
// import { UseBeforeLeave } from "./hook/useBeforeLeave";
//import { UseFadeIn } from "./hook/useFadeIn";
//import { UseNetwork } from "./hook/useNetwork";
import { UseScroll } from "./hook/useScroll";
import { UseFullscreen } from "./hook/useFullscreen";
import { UseAxios } from "./hook/useAxios/useAxios";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/usefullscreen" />} />
        {/* <Route path="/useinput" element={<useinput />} /> */}
        {/* <Route path="/useinput" element={<usetabs />} /> */}
        {/* <Route path="/usetitle" element={<usetitle />} /> */}
        {/* <Route path="/useclick" element={<useclick />} /> */}
        {/* <Route path="/useconfirm" element={<UseConfirm />} /> */}
        {/* <Route path="/usepreventLeave" element={<UsePreventLeave />} /> */}
        {/* <Route path="/useBeforeLeave" element={<UseBeforeLeave />} /> */}
        {/* <Route path="/usefadein" element={<UseFadeIn />} /> */}
        {/* <Route path="/usenetwork" element={<UseNetwork />} /> */}
        {/* <Route path="/usescroll" element={<UseScroll />} /> */}
        {/* <Route path="/usefullscreen" element={<UseFullscreen />} /> */}
        {/* <Route path="/usenotification" element={<UseNotification />} /> */}
        <Route path="/useaxios" element={<UseAxios />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
