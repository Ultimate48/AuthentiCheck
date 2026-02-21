import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import LoginPage from "./pages/LoginPage";
import AdminPage from "./pages/AdminPage";
import QRScannerPage from "./pages/QRScannerPage";
import ProductTrackingPage from "./pages/ProductTrackingPage";
import DashboardLayout from "./layouts/DashboardLayout";

function App() {
  return (
    <Router>

      <Routes>

        {/* PUBLIC ROUTES */}
        <Route path="/" element={<LoginPage />} />
        <Route path="/track" element={<ProductTrackingPage />} />


        {/* DASHBOARD ROUTES */}
        <Route element={<DashboardLayout />}>
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/scanner" element={<QRScannerPage />} />
        </Route>

      </Routes>

    </Router>
  );
}

export default App;