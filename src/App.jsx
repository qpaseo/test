import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout.jsx";
import HomePage from "./pages/HomePage.jsx";
import AwsCalculator from "./pages/AwsCalculator.jsx";
import AzureCalculator from "./pages/AzureCalculator.jsx";
import GcpCalculator from "./pages/GcpCalculator.jsx";
import FirebaseCalculator from "./pages/FierbaseCalculator.jsx";
import SupabaseCalculator from "./pages/SupabaseCalculator.jsx";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="aws" element={<AwsCalculator />} />
        <Route path="azure" element={<AzureCalculator />} />
        <Route path="gcp" element={<GcpCalculator />} />
        <Route path="firebase" element={<FirebaseCalculator />} />
        <Route path="supabase" element={<SupabaseCalculator />} />
      </Route>
    </Routes>
  );
}

export default App;
