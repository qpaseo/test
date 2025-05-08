import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import HomePage from "./pages/HomePage";
import AwsCalculator from "./pages/AwsCalculator";
import AzureCalculator from "./pages/AzureCalculator";
import GcpCalculator from "./pages/GcpCalculator";
import FirebaseCalculator from "./pages/FierbaseCalculator";
import SupabaseCalculator from "./pages/SupabaseCalculator";

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
