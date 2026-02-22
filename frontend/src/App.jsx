import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";

import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Verify from './pages/Verify'
import Admin from './pages/Admin'
import Home from './pages/Home'
import Sidebar from './layouts/sidebar'

const NO_SIDEBAR_ROUTES = ['/login', '/']

function Layout() {
  const location = useLocation()
  const showSidebar = !NO_SIDEBAR_ROUTES.includes(location.pathname)

  return (
    <div className="flex min-h-screen">
      {showSidebar && <Sidebar />}
      <main className={`flex-1 ${showSidebar ? 'ml-60' : ''}`}>
        <Routes>
          <Route path="/home"            element={<Home />} />
          <Route path="/"                element={<Navigate to="/home" />} />
          <Route path="/login"           element={<Login />} />
          <Route path="/dashboard"       element={<Dashboard />} />
          <Route path="/verify"          element={<Verify />} />
          <Route path="/verify/:batchId" element={<Verify />} />
          <Route path="/admin"           element={<Admin />} />
        </Routes>
      </main>
    </div>
  )
}

function App() {
  return (
    <Router>
      <Layout />
    </Router>
  )
}

export default App;