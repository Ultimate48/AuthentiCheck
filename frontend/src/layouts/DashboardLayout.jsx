import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";

export default function DashboardLayout() {
  return (
    <div className="flex min-h-screen bg-gray-100">

      {/* LEFT SIDEBAR */}
      <Sidebar />

      {/* RIGHT CONTENT */}
      <div className="flex-1 p-8">

        {/* HEADER */}
        <Header />

        {/* PAGE CONTENT */}
        <div className="mt-6">
          <Outlet />
        </div>

      </div>

    </div>
  );
}