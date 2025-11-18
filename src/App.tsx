import { Suspense } from "react";
import { AuthProvider } from "./contexts/AuthContext";
import AppContent from "./router/router";

function App() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-orange-500 border-t-transparent"></div>
        </div>
      }
    >
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Suspense>
  );
}

export default App;
