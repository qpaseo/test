import Login from "../components/Login";
import Signup from "../components/Signup";
import Layout from "../components/Layout";
import MainPage from "../components/MainPage";
import StatesPage from "../components/StatesPage";
import ProfilePage from "../components/ProfilePage";
import { useAuth } from "../contexts/AuthContext";
import { useState } from "react";

export default function AppContent() {
  const { currentUser } = useAuth();
  const [authMode, setAuthMode] = useState<"login" | "signup">("login");
  const [currentPage, setCurrentPage] = useState<"main" | "states" | "profile">(
    "main"
  );

  if (!currentUser) {
    if (authMode === "login") {
      return <Login onSwitchToSignup={() => setAuthMode("signup")} />;
    }
    return <Signup onSwitchToLogin={() => setAuthMode("login")} />;
  }

  return (
    <Layout currentPage={currentPage} onNavigate={setCurrentPage}>
      {currentPage === "main" && <MainPage />}
      {currentPage === "states" && <StatesPage />}
      {currentPage === "profile" && <ProfilePage />}
    </Layout>
  );
}
