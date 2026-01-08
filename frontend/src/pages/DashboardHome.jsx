import { useState, useEffect } from "react";
import { Truck, Leaf, Calendar, CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function DashboardHome() {
  const [stats, setStats] = useState({
    specialRequests: 0,
    compostRequests: 0,
    pendingRequests: 0,
    approvedRequests: 0
  });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (token) {
      fetchStats();
    }
  }, [token]);

  const fetchStats = async () => {
    if (!token) return;
    
    try {
      setLoading(true);
      const [specialRes, compostRes] = await Promise.all([
        fetch("http://localhost:8000/api/special-request/", {
          headers: { Authorization: `Token ${token}` },
        }),
        fetch("http://localhost:8000/api/compost-request/", {
          headers: { Authorization: `Token ${token}` },
        }),
      ]);

      if (!specialRes.ok || !compostRes.ok) {
        throw new Error('Failed to fetch data');
      }

      const specialData = await specialRes.json();
      const compostData = await compostRes.json();

      const pending = Array.isArray(specialData) ? specialData.filter(req => req.status === 'pending').length : 0;
      const approved = Array.isArray(specialData) ? specialData.filter(req => req.status === 'approved').length : 0;

      setStats({
        specialRequests: Array.isArray(specialData) ? specialData.length : 0,
        compostRequests: Array.isArray(compostData) ? compostData.length : 0,
        pendingRequests: pending,
        approvedRequests: approved
      });
    } catch (error) {
      console.error("Failed to fetch stats:", error);
      setStats({
        specialRequests: 0,
        compostRequests: 0,
        pendingRequests: 0,
        approvedRequests: 0
      });
    } finally {
      setLoading(false);
    }
  };

  const cards = [
    {
      title: "Special Requests",
      value: stats.specialRequests,
      icon: Truck,
      color: "bg-blue-500",
      bgColor: "bg-blue-50",
      action: () => navigate("/user-dashboard/special-request")
    },
    {
      title: "Compost Requests", 
      value: stats.compostRequests,
      icon: Leaf,
      color: "bg-green-500",
      bgColor: "bg-green-50",
      action: () => navigate("/user-dashboard/compost-request")
    },
    {
      title: "Pending Requests",
      value: stats.pendingRequests,
      icon: Calendar,
      color: "bg-yellow-500",
      bgColor: "bg-yellow-50",
      action: () => navigate("/user-dashboard/my-requests")
    },
    {
      title: "Approved Requests",
      value: stats.approvedRequests,
      icon: CheckCircle,
      color: "bg-emerald-500",
      bgColor: "bg-emerald-50",
      action: () => navigate("/user-dashboard/my-requests")
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Manage your waste collection requests</p>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {cards.map((card, index) => (
              <div
                key={index}
                onClick={card.action}
                className={`${card.bgColor} p-6 rounded-lg shadow-sm border cursor-pointer hover:shadow-md transition-shadow`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{card.title}</p>
                    <p className="text-3xl font-bold text-gray-900">{card.value}</p>
                  </div>
                  <div className={`${card.color} p-3 rounded-full`}>
                    <card.icon className="h-6 w-6 text-white" />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button
                onClick={() => navigate("/user-dashboard/special-request")}
                className="flex items-center gap-3 p-4 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
              >
                <Truck className="h-5 w-5 text-blue-600" />
                <span className="font-medium text-blue-900">New Special Request</span>
              </button>
              <button
                onClick={() => navigate("/user-dashboard/compost-request")}
                className="flex items-center gap-3 p-4 bg-green-50 hover:bg-green-100 rounded-lg transition-colors"
              >
                <Leaf className="h-5 w-5 text-green-600" />
                <span className="font-medium text-green-900">New Compost Request</span>
              </button>
              <button
                onClick={() => navigate("/user-dashboard/my-requests")}
                className="flex items-center gap-3 p-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Calendar className="h-5 w-5 text-gray-600" />
                <span className="font-medium text-gray-900">View All Requests</span>
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}