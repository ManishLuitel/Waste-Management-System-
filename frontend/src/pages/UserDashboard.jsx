import { Outlet, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { User, Truck, Leaf, List, LogOut, Home, Calendar, CreditCard, History, TrendingUp, FileText } from "lucide-react";

export default function UserDashboard() {
  const navigate = useNavigate();
  const [userEmail, setUserEmail] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/userlogin");
    } else {
      // Get user email from localStorage or decode token
      const email = localStorage.getItem("userEmail") || "user@example.com";
      setUserEmail(email);
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userEmail");
    navigate("/");
  };

  const menuItems = [
    { path: "/user-dashboard", icon: Home, label: "Dashboard", exact: true },
    { path: "/user-dashboard/schedule", icon: Calendar, label: "Schedule" },
    { path: "/user-dashboard/special-request", icon: Truck, label: "Special Request" },
    { path: "/user-dashboard/compost-request", icon: Leaf, label: "Compost Request" },
    { path: "/user-dashboard/my-requests", icon: List, label: "My Requests" },
    { path: "/user-dashboard/monthly-payment", icon: CreditCard, label: "Monthly Payment" },
    { path: "/user-dashboard/invoices", icon: FileText, label: "Invoices" },
    { path: "/user-dashboard/payment-history", icon: History, label: "Payment History" },
    { path: "/user-dashboard/payment-stats", icon: TrendingUp, label: "Payment Stats" },
  ];

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="bg-green-100 p-2 rounded-full">
              <User className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <h2 className="font-semibold text-gray-800">Welcome</h2>
              <p className="text-sm text-gray-600 truncate">{userEmail}</p>
            </div>
          </div>
        </div>

        <nav className="p-4">
          <ul className="space-y-2">
            {menuItems.map((item) => (
              <li key={item.path}>
                <button
                  onClick={() => navigate(item.path)}
                  className="w-full flex items-center gap-3 px-4 py-3 text-left text-gray-700 hover:bg-green-50 hover:text-green-600 rounded-lg transition-colors"
                >
                  <item.icon className="h-5 w-5" />
                  {item.label}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        <div className="absolute bottom-4 left-4 right-4">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <LogOut className="h-5 w-5" />
            Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8 overflow-y-auto">
        <Outlet />
      </div>
    </div>
  );
}