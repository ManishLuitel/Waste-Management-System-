import { Link, useNavigate } from "react-router-dom";

export default function AdminSidebar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    navigate("/login");
  };

  return (
    <div className="bg-green-800 text-white min-h-screen w-64 flex flex-col p-4 sticky top-0">
      <div className="mb-8">
        <h1 className="text-xl font-bold text-center border-b border-green-600 pb-3 mb-3">
          Waste Management System
        </h1>
        <h2 className="text-lg font-semibold text-center text-green-200">
          Admin Panel
        </h2>
      </div>

      <nav className="flex flex-col space-y-3 text-lg">
        <Link
          to="/admin/schedules"
          className="hover:bg-green-700 px-3 py-2 rounded transition"
        >
          Schedule Manager
        </Link>

        <Link
          to="/admin/special-requests"
          className="hover:bg-green-700 px-3 py-2 rounded transition"
        >
          Special Requests
        </Link>

        <Link
          to="/admin/compost-requests"
          className="hover:bg-green-700 px-3 py-2 rounded transition"
        >
          Compost Requests
        </Link>

        <div className="border-t border-green-600 my-2"></div>
        <p className="text-green-200 text-sm font-medium px-3">User Management</p>
        
        <Link
          to="/admin/users"
          className="hover:bg-green-700 px-3 py-2 rounded transition"
        >
          User Management
        </Link>

        <Link
          to="/admin/password-resets"
          className="hover:bg-green-700 px-3 py-2 rounded transition"
        >
          Password Resets
        </Link>

        <div className="border-t border-green-600 my-2"></div>
        <p className="text-green-200 text-sm font-medium px-3">Data Management</p>
        
        <Link
          to="/admin/waste-types"
          className="hover:bg-green-700 px-3 py-2 rounded transition"
        >
          Waste Types
        </Link>

        <Link
          to="/admin/collection-days"
          className="hover:bg-green-700 px-3 py-2 rounded transition"
        >
          Collection Days
        </Link>

        <Link
          to="/admin/wards"
          className="hover:bg-green-700 px-3 py-2 rounded transition"
        >
          Ward Management
        </Link>

        <div className="border-t border-green-600 my-2"></div>
        <p className="text-green-200 text-sm font-medium px-3">Payment Management</p>
        
        <Link
          to="/admin/payment-settings"
          className="hover:bg-green-700 px-3 py-2 rounded transition"
        >
          Payment Settings
        </Link>

        <Link
          to="/admin/payment-manager"
          className="hover:bg-green-700 px-3 py-2 rounded transition"
        >
          Payment Manager
        </Link>

        <Link
          to="/admin/payment-stats"
          className="hover:bg-green-700 px-3 py-2 rounded transition"
        >
          Payment Statistics
        </Link>

        <button
          onClick={handleLogout}
          className="mt-auto bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded transition"
        >
          Logout
        </button>
      </nav>
    </div>
  );
}
