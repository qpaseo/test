import { AuthProvider } from "./contexts/AuthContext";
import AppContent from "./router/router";

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
