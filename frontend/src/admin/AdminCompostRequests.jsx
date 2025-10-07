import { useEffect, useState } from "react";

export default function AdminCompostRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

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
    if (!window.confirm("Delete this compost request?")) return;
    fetch(`/api/compost-request/${id}/`, {
      method: "DELETE",
      headers: { Authorization: `Token ${token}` },
    }).then(() => fetchRequests());
  };

  if (loading) return <p>Loading compost requests...</p>;

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">🌱 Compost Requests</h2>
      <div className="grid md:grid-cols-2 gap-4">
        {requests.map((req) => (
          <div
            key={req.id}
            className="p-4 border rounded shadow bg-gray-50"
          >
            <p><strong>Name:</strong> {req.name}</p>
            <p><strong>Contact:</strong> {req.contact}</p>
            <p><strong>Location:</strong> {req.location}</p>
            <p><strong>Waste Type:</strong> {req.waste_type}</p>
            <p><strong>Quantity:</strong> {req.quantity}</p>
            {req.message && <p><strong>Message:</strong> {req.message}</p>}
            <button
              onClick={() => handleDelete(req.id)}
              className="mt-2 bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
            >
              🗑 Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
