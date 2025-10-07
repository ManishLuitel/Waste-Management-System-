import { Link, useNavigate } from "react-router-dom";

export default function AdminSidebar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="bg-green-800 text-white min-h-screen w-64 flex flex-col p-4 sticky top-0">
      <h2 className="text-2xl font-bold mb-8 text-center border-b border-green-600 pb-2">
        Admin Panel
      </h2>

      <nav className="flex flex-col space-y-3 text-lg">
        <Link
          to="/admin/schedules"
          className="hover:bg-green-700 px-3 py-2 rounded transition"
        >
          📅 Schedule Manager
        </Link>

        <Link
          to="/admin/special-requests"
          className="hover:bg-green-700 px-3 py-2 rounded transition"
        >
          🗑 Special Requests
        </Link>

        <Link
          to="/admin/compost-request"
          className="hover:bg-green-700 px-3 py-2 rounded transition"
        >
          🌿 Compost Requests
        </Link>

        <button
          onClick={handleLogout}
          className="mt-auto bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded transition"
        >
          🚪 Logout
        </button>
      </nav>
    </div>
  );
}
