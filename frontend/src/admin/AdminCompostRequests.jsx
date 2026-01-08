import { useEffect, useState } from "react";

export default function AdminCompostRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteRequestId, setDeleteRequestId] = useState(null);
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
    fetch("/api/compost-request/", {
      headers: { Authorization: `Token ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        setRequests(data);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleDelete = (id) => {
    setDeleteRequestId(id);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = () => {
    fetch(`/api/compost-request/${deleteRequestId}/`, {
      method: "DELETE",
      headers: { Authorization: `Token ${token}` },
    })
      .then(res => {
        if (!res.ok) throw new Error("Failed to delete request");
        showMessage("Compost request deleted successfully!");
        fetchRequests();
      })
      .catch(err => showMessage(err.message, "error"))
      .finally(() => {
        setShowDeleteConfirm(false);
        setDeleteRequestId(null);
      });
  };

  const cancelDelete = () => {
    setShowDeleteConfirm(false);
    setDeleteRequestId(null);
  };

  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <div className="text-lg text-gray-600">Loading compost requests...</div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Message */}
      {message && (
        <div className={`p-4 rounded-lg border ${
          messageType === "error" 
            ? "bg-red-50 border-red-200 text-red-700" 
            : "bg-green-50 border-green-200 text-green-700"
        }`}>
          {message}
        </div>
      )}

      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h1 className="text-2xl font-bold text-gray-800">Compost Requests</h1>
        <p className="text-gray-600 mt-2">Manage compost collection requests from users</p>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Requests</p>
              <p className="text-2xl font-bold text-gray-900">{requests.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Confirm Delete</h3>
            <p className="text-gray-600 mb-6">Are you sure you want to delete this compost request? This action cannot be undone.</p>
            <div className="flex space-x-3">
              <button
                onClick={confirmDelete}
                className="flex-1 bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors"
              >
                Delete
              </button>
              <button
                onClick={cancelDelete}
                className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Requests Grid */}
      {requests.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm p-12 text-center">
          <h3 className="text-lg font-medium text-gray-900 mb-2">No compost requests</h3>
          <p className="text-gray-500">No compost requests have been submitted yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {requests.map((req) => (
            <div key={req.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <h3 className="font-semibold text-gray-900">{req.name}</h3>
                </div>
                
                <div className="space-y-3">
                  <div className="text-sm">
                    <span className="font-medium text-gray-500">Contact:</span>
                    <span className="text-gray-700 ml-2">{req.contact}</span>
                  </div>
                  
                  <div className="text-sm">
                    <span className="font-medium text-gray-500">Location:</span>
                    <span className="text-gray-700 ml-2">{req.location}</span>
                  </div>
                  
                  <div className="text-sm">
                    <span className="font-medium text-gray-500">Waste Type:</span>
                    <span className="text-gray-700 ml-2">{req.waste_type}</span>
                  </div>
                  
                  <div className="text-sm">
                    <span className="font-medium text-gray-500">Quantity:</span>
                    <span className="text-gray-700 ml-2">{req.quantity}</span>
                  </div>
                  
                  {req.message && (
                    <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Message:</span> {req.message}
                      </p>
                    </div>
                  )}
                </div>
                
                <div className="mt-6 pt-4 border-t border-gray-100">
                  <button
                    onClick={() => handleDelete(req.id)}
                    className="w-full bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors font-medium"
                  >
                    Delete Request
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}