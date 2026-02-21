import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import LoginPage from "./pages/LoginPage";
import MemberDashboard from "./pages/MemberDashboard";
import CustomerPage from "./pages/CustomerPage";
import AdminPanel from "./pages/AdminPanel";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MemberDashboard />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/dashboard" element={<MemberDashboard />} />
        <Route path="/customer" element={<CustomerPage />} />
        <Route path="/admin" element={<AdminPanel />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;