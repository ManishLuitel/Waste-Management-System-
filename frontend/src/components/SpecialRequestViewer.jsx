import { useEffect, useState } from 'react'

export default function SpecialRequestViewer() {
  const [requests, setRequests] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = navigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    fetch("/api/special-requests/", {
      headers: {
        Authorization: `Token ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setRequests(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching compost requests:", err);
        setLoading(false);
      });
  }, [navigate]);

  if (loading) return <p className="text-center py-10 text-gray-600">Loading requests...</p>

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-green-700 mb-6 text-center">📋 Special Pickup Requests</h2>

        {requests.length === 0 ? (
          <p className="text-center text-gray-500">No requests found.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {requests.map((req) => (
              <div
                key={req.id}
                className="bg-white shadow-lg rounded-xl p-6 border border-green-100 hover:shadow-xl transition-all"
              >
                <h3 className="text-xl font-semibold text-green-800 mb-2">{req.name}</h3>
                <p className="text-sm text-gray-600 mb-1"><strong>Email:</strong> {req.email}</p>
                <p className="text-sm text-gray-600 mb-1"><strong>Address:</strong> {req.address}</p>
                <p className="text-sm text-gray-600 mb-1"><strong>Reason:</strong> {req.reason}</p>
                <p className="text-sm text-gray-600 mb-1"><strong>Date:</strong> {req.preferred_date}</p>
                <p className="text-sm text-gray-600"><strong>Time:</strong> {req.preferred_time}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
