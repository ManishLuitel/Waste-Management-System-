import { useState, useEffect } from "react";
import { Check, X, Mail, User, Clock, AlertCircle } from "lucide-react";

export default function PasswordResetManager() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [showTempPassword, setShowTempPassword] = useState(false);
  const [tempPasswordData, setTempPasswordData] = useState(null);
  const [filter, setFilter] = useState("all");

  const token = localStorage.getItem("adminToken");

  const showMessage = (text, type = "success") => {
    setMessage(text);
    setMessageType(type);
    setTimeout(() => {
      setMessage("");
      setMessageType("");
    }, 3000);
  };

  const fetchRequests = () => {
    fetch("http://localhost:8000/api/auth/password-reset-requests/", {
      headers: { Authorization: `Token ${token}` },
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP ${res.status}: ${res.statusText}`);
        }
        return res.json();
      })
      .then((data) => {
        setRequests(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching password reset requests:", error);
        showMessage(`Failed to load requests: ${error.message}`, "error");
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleApprove = (id) => {
    fetch(`http://localhost:8000/api/auth/password-reset-requests/${id}/approve/`, {
      method: "POST",
      headers: { Authorization: `Token ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.temporary_password) {
          setTempPasswordData({
            email: requests.find(r => r.id === id)?.user_email,
            password: data.temporary_password
          });
          setShowTempPassword(true);
        }
        showMessage("Password reset request approved successfully!");
        fetchRequests();
      })
      .catch((err) => showMessage(err.message, "error"));
  };

  const handleReject = (id) => {
    fetch(`http://localhost:8000/api/auth/password-reset-requests/${id}/reject/`, {
      method: "POST",
      headers: { Authorization: `Token ${token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to reject request");
        showMessage("Password reset request rejected successfully!");
        fetchRequests();
      })
      .catch((err) => showMessage(err.message, "error"));
  };

  const filteredRequests = requests.filter((req) =>
    filter === "all" || req.status?.toLowerCase() === filter
  );

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
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Message */}
      {message && (
        <div
          className={`p-4 rounded-lg border ${
            messageType === "error"
              ? "bg-red-50 border-red-200 text-red-700"
              : "bg-green-50 border-green-200 text-green-700"
          }`}
        >
          {message}
        </div>
      )}

      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Password Reset Requests</h1>
            <p className="text-gray-600 mt-1">Manage user password reset requests</p>
          </div>
          <div className="bg-blue-50 px-4 py-2 rounded-lg">
            <span className="text-2xl font-bold text-blue-600">{requests.length}</span>
            <p className="text-sm text-blue-600">Total Requests</p>
          </div>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex items-center space-x-3">
            <div className="bg-yellow-100 p-2 rounded-lg">
              <Clock className="h-5 w-5 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Pending</p>
              <p className="text-xl font-bold text-gray-900">
                {requests.filter((r) => r.status === "pending").length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex items-center space-x-3">
            <div className="bg-green-100 p-2 rounded-lg">
              <Check className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Approved</p>
              <p className="text-xl font-bold text-gray-900">
                {requests.filter((r) => r.status === "approved").length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex items-center space-x-3">
            <div className="bg-red-100 p-2 rounded-lg">
              <X className="h-5 w-5 text-red-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Rejected</p>
              <p className="text-xl font-bold text-gray-900">
                {requests.filter((r) => r.status === "rejected").length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border p-4">
        <div className="flex space-x-2">
          {["all", "pending", "approved", "rejected"].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === status
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
              {status !== "all" && (
                <span className="ml-2 bg-white bg-opacity-20 px-2 py-0.5 rounded-full text-xs">
                  {requests.filter((r) => r.status?.toLowerCase() === status).length}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Temporary Password Modal */}
      {showTempPassword && tempPasswordData && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Temporary Password Generated</h3>
            <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-sm text-gray-600 mb-2">User: <strong>{tempPasswordData.email}</strong></p>
              <p className="text-sm text-gray-600 mb-2">Temporary Password:</p>
              <div className="bg-gray-100 p-3 rounded font-mono text-lg text-center border">
                {tempPasswordData.password}
              </div>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              Please share this temporary password with the user. They can use it to login and change their password.
            </p>
            <div className="flex space-x-3">
              <button
                onClick={() => navigator.clipboard.writeText(tempPasswordData.password)}
                className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Copy Password
              </button>
              <button
                onClick={() => {
                  setShowTempPassword(false);
                  setTempPasswordData(null);
                }}
                className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Requests Grid */}
      {filteredRequests.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm border p-12 text-center">
          <AlertCircle className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No requests found</h3>
          <p className="text-gray-600">No password reset requests match your current filter.</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredRequests.map((req) => (
            <div
              key={req.id}
              className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow"
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="bg-blue-100 p-2 rounded-lg">
                      <User className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{req.user_email}</h3>
                      <p className="text-sm text-gray-600">
                        {new Date(req.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                      req.status
                    )}`}
                  >
                    {req.status || "Pending"}
                  </span>
                </div>

                <div className="flex items-center space-x-2 text-sm text-gray-600 mb-4">
                  <Mail className="h-4 w-4" />
                  <span>{req.user_email}</span>
                </div>

                {req.status === "pending" && (
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleApprove(req.id)}
                      className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleReject(req.id)}
                      className="flex-1 bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
                    >
                      Reject
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}