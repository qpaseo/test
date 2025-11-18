import React from "react";
import ReactDOM from "react-dom/client";
import "./i18n"; // ✅ App보다 먼저 import (매우 중요!)
import App from "./App.tsx";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
