import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Verify from './pages/Verify'
import Admin from './pages/Admin'

function App() {
  return (
    <Router>

      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/verify" element={<Verify />} />
        <Route path="/verify/:batchId" element={<Verify />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>

    </Router>
  );
}

export default App;