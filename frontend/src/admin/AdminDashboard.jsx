

import { Outlet, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import AdminSidebar from "../components/AdminSidebar";

export default function AdminDashboard() {
  const navigate = useNavigate();

  // Redirect if not logged in
  useEffect(() => {
    const adminToken = localStorage.getItem("adminToken");
    if (!adminToken) {
      navigate("/login");
    }
  }, [navigate]);

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <AdminSidebar />

      {/* Main Content */}
      <div className="flex-1 p-8 overflow-y-auto">
        <Outlet /> {/* Child admin pages (like schedule, compost, etc.) render here */}
      </div>
    </div>
  );
}


