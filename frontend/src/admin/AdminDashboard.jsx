// import { useState } from "react";
// import AdminScheduleManager from "./AdminScheduleManager";
// import AdminSpecialRequests from "./AdminSpecialRequests";
// import AdminCompostRequests from "./AdminCompostRequests";

// export default function AdminDashboard() {
//   const [activeTab, setActiveTab] = useState("schedule");

//   const tabs = [
//     { key: "schedule", label: "📅 Schedules" },
//     { key: "special", label: "📦 Special Requests" },
//     { key: "compost", label: "🌱 Compost Requests" },
//   ];

//   return (
//     <div className="max-w-6xl mx-auto p-6">
//       <h1 className="text-3xl font-bold text-green-700 mb-6">🛠 Admin Dashboard</h1>

//       {/* Tabs */}
//       <div className="flex space-x-4 border-b mb-6">
//         {tabs.map((tab) => (
//           <button
//             key={tab.key}
//             onClick={() => setActiveTab(tab.key)}
//             className={`px-4 py-2 rounded-t-lg ${
//               activeTab === tab.key
//                 ? "bg-green-600 text-white"
//                 : "bg-gray-200 text-gray-700 hover:bg-gray-300"
//             }`}
//           >
//             {tab.label}
//           </button>
//         ))}
//       </div>

//       {/* Content */}
//       <div className="bg-white p-4 rounded-lg shadow">
//         {activeTab === "schedule" && <AdminScheduleManager />}
//         {activeTab === "special" && <AdminSpecialRequests />}
//         {activeTab === "compost" && <AdminCompostRequests />}
//       </div>
//     </div>
//   );
// }

import { Outlet, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import AdminSidebar from "../components/AdminSidebar";

export default function AdminDashboard() {
  const navigate = useNavigate();

  // Redirect if not logged in
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
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


