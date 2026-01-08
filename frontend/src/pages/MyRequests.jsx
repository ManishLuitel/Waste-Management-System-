import { useState, useEffect } from "react";
import { Calendar, MapPin, MessageSquare, Package, User } from "lucide-react";

export default function MyRequests() {
  const [specialRequests, setSpecialRequests] = useState([]);
  const [compostRequests, setCompostRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("special");

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (token) {
      fetchRequests();
      // Add debug call
      debugUserInfo();
    }
  }, [token]);

  const debugUserInfo = async () => {
    try {
      const response = await fetch("http://localhost:8000/api/debug-user-requests/", {
        headers: { 
          'Authorization': `Token ${token}`,
          'Content-Type': 'application/json'
        },
      });
      const data = await response.json();
      console.log('Debug user info:', data);
    } catch (error) {
      console.error('Debug call failed:', error);
    }
  };

  const fetchRequests = async () => {
    if (!token) {
      console.log('No token found');
      setLoading(false);
      return;
    }
    
    try {
      console.log('Fetching requests with token:', token);
      const [specialRes, compostRes] = await Promise.all([
        fetch("http://localhost:8000/api/special-request/", {
          headers: { 
            'Authorization': `Token ${token}`,
            'Content-Type': 'application/json'
          },
        }),
        fetch("http://localhost:8000/api/compost-request/", {
          headers: { 
            'Authorization': `Token ${token}`,
            'Content-Type': 'application/json'
          },
        }),
      ]);

      console.log('Special response status:', specialRes.status);
      console.log('Compost response status:', compostRes.status);

      if (specialRes.status === 401 || compostRes.status === 401) {
        console.error('Authentication failed - token may be expired');
        localStorage.removeItem('token');
        localStorage.removeItem('userEmail');
        window.location.href = '/userlogin';
        return;
      }

      if (!specialRes.ok || !compostRes.ok) {
        const specialError = await specialRes.text();
        const compostError = await compostRes.text();
        console.error('API Error - Special:', specialError);
        console.error('API Error - Compost:', compostError);
        throw new Error('Failed to fetch requests');
      }

      const specialData = await specialRes.json();
      const compostData = await compostRes.json();

      console.log('Special requests data:', specialData);
      console.log('Compost requests data:', compostData);

      setSpecialRequests(Array.isArray(specialData) ? specialData : []);
      setCompostRequests(Array.isArray(compostData) ? compostData : []);
      setLoading(false);
    } catch (error) {
      console.error("Failed to fetch requests:", error);
      setSpecialRequests([]);
      setCompostRequests([]);
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "approved":
        return "bg-green-100 text-green-800 border-green-200";
      case "rejected":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">My Requests</h1>
        <p className="text-gray-600">View your special waste collection and compost requests</p>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-sm">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            <button
              onClick={() => setActiveTab("special")}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === "special"
                  ? "border-green-500 text-green-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              Special Requests ({specialRequests.length})
            </button>
            <button
              onClick={() => setActiveTab("compost")}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === "compost"
                  ? "border-green-500 text-green-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              Compost Requests ({compostRequests.length})
            </button>
          </nav>
        </div>

          <div className="p-6">
            {activeTab === "special" && (
              <div>
                {specialRequests.length === 0 ? (
                  <div className="text-center py-12">
                    <User className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No special requests</h3>
                    <p className="text-gray-600">You haven't made any special waste collection requests yet.</p>
                  </div>
                ) : (
                  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {specialRequests.map((req) => (
                      <div key={req.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between mb-3">
                          <h3 className="font-semibold text-gray-900">{req.name}</h3>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(req.status)}`}>
                            {req.status || "Pending"}
                          </span>
                        </div>

                        <div className="space-y-2 text-sm text-gray-600">
                          <div className="flex items-center space-x-2">
                            <MapPin className="h-4 w-4" />
                            <span>{req.address}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Calendar className="h-4 w-4" />
                            <span>{req.preferred_date} at {req.preferred_time}</span>
                          </div>
                          {req.reason && (
                            <div className="flex items-start space-x-2">
                              <MessageSquare className="h-4 w-4 mt-0.5" />
                              <span>{req.reason}</span>
                            </div>
                          )}
                        </div>

                        <div className="mt-3 pt-3 border-t border-gray-100">
                          <p className="text-xs text-gray-500">
                            Submitted: {new Date(req.submitted_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === "compost" && (
              <div>
                {compostRequests.length === 0 ? (
                  <div className="text-center py-12">
                    <Package className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No compost requests</h3>
                    <p className="text-gray-600">You haven't made any compost collection requests yet.</p>
                  </div>
                ) : (
                  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {compostRequests.map((req) => (
                      <div key={req.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between mb-3">
                          <h3 className="font-semibold text-gray-900">{req.name}</h3>
                        </div>

                        <div className="space-y-2 text-sm text-gray-600">
                          <div className="flex items-center space-x-2">
                            <User className="h-4 w-4" />
                            <span>{req.contact}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <MapPin className="h-4 w-4" />
                            <span>{req.location}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Package className="h-4 w-4" />
                            <span>{req.waste_type} - {req.quantity}</span>
                          </div>
                          {req.message && (
                            <div className="flex items-start space-x-2">
                              <MessageSquare className="h-4 w-4 mt-0.5" />
                              <span>{req.message}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
        </div>
      </div>
    </div>
  );
}