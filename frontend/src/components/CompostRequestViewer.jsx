import { useEffect, useState } from 'react'

function CompostRequestViewer() {
  const [requests, setRequests] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = navigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    fetch('/api/compost-request/', {
      headers: { Authorization: `Token ${token}` },
    })
      .then(res => {
        if (res.status === 401) {
          navigate("/login");
          return [];
        }
        return res.json();
      })
      .then(data => {
        setRequests(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching compost requests:", err);
        setLoading(false);
      });
  }, [navigate]);

  if (loading) return <p className="text-center mt-10">Loading compost requests...</p>

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h2 className="text-2xl font-bold text-green-800 mb-6 text-center">📋 Compost Requests</h2>
      <div className="grid md:grid-cols-2 gap-6">
        {requests.map(req => (
          <div key={req.id} className="bg-white rounded-lg shadow p-4 border border-green-200">
            <p><strong>Name:</strong> {req.name}</p>
            <p><strong>Contact:</strong> {req.contact}</p>
            <p><strong>Location:</strong> {req.location}</p>
            <p><strong>Waste Type:</strong> {req.waste_type}</p>
            <p><strong>Quantity:</strong> {req.quantity}</p>
            {req.message && <p><strong>Message:</strong> {req.message}</p>}
            <p className="text-sm text-gray-500 mt-2">Submitted: {new Date(req.submitted_at).toLocaleString()}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default CompostRequestViewer
