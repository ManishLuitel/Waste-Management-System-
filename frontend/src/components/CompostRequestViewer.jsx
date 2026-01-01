// import { useEffect, useState } from 'react'
// import { useNavigate } from 'react-router-dom'

// function CompostRequestViewer() {
//   const [requests, setRequests] = useState([])
//   const [loading, setLoading] = useState(true)
//   const navigate = useNavigate();

//   useEffect(() => {
//     const token = localStorage.getItem("token");
//     if (!token) {
//       navigate("/login");
//       return;
//     }

//     fetch("http://localhost:8000/api/compost-request/", {
//       headers: { Authorization: `Token ${token}` },
//     })
//       .then(res => {
//         if (res.status === 401) {
//           navigate("/login");
//           return [];
//         }
//         return res.json();
//       })
//       .then(data => {
//         setRequests(data);
//         setLoading(false);
//       })
//       .catch(err => {
//         console.error("Error fetching compost requests:", err);
//         setLoading(false);
//       });
//   }, [navigate]);

//   if (loading) return <p className="text-center mt-10">Loading compost requests...</p>

//   return (
//     <div className="max-w-5xl mx-auto p-6">
//       <h2 className="text-2xl font-bold text-green-800 mb-6 text-center">📋 Compost Requests</h2>
//       <div className="grid md:grid-cols-2 gap-6">
//         {requests.map(req => (
//           <div key={req.id} className="bg-white rounded-lg shadow p-4 border border-green-200">
//             <p><strong>Name:</strong> {req.name}</p>
//             <p><strong>Contact:</strong> {req.contact}</p>
//             <p><strong>Location:</strong> {req.location}</p>
//             <p><strong>Waste Type:</strong> {req.waste_type}</p>
//             <p><strong>Quantity:</strong> {req.quantity}</p>
//             {req.message && <p><strong>Message:</strong> {req.message}</p>}
//             <p className="text-sm text-gray-500 mt-2">Submitted: {new Date(req.submitted_at).toLocaleString()}</p>
//           </div>
//         ))}
//       </div>
//     </div>
//   )
// }

// export default CompostRequestViewer


import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function CompostRequestViewer() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login"); // redirect if no token
      return;
    }

    fetch("http://localhost:8000/api/compost-request/", {
      headers: {
        Authorization: `Token ${token}`,
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        if (res.status === 401 || res.status === 403) {
          // unauthorized or forbidden
          navigate("/login");
          return [];
        }
        if (!res.ok) throw new Error("Failed to fetch compost requests");
        return res.json();
      })
      .then((data) => {
        setRequests(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("❌ Error fetching compost requests:", err);
        setLoading(false);
      });
  }, [navigate]);

  if (loading)
    return (
      <p className="text-center mt-10 text-gray-600">
        ⏳ Loading compost requests...
      </p>
    );

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-6">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-3xl font-bold text-green-800 mb-8 text-center">
          📋 Compost Request Records
        </h2>

        {requests.length === 0 ? (
          <p className="text-center text-gray-500">
            No compost requests found.
          </p>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {requests.map((req) => (
              <div
                key={req.id}
                className="bg-white shadow-lg rounded-xl p-6 border border-green-100 hover:shadow-xl transition-all"
              >
                <h3 className="text-lg font-semibold text-green-700 mb-2">
                  {req.name}
                </h3>
                <p className="text-sm text-gray-700 mb-1">
                  <strong>📞 Contact:</strong> {req.contact}
                </p>
                <p className="text-sm text-gray-700 mb-1">
                  <strong>📍 Location:</strong> {req.location}
                </p>
                <p className="text-sm text-gray-700 mb-1">
                  <strong>♻ Waste Type:</strong> {req.waste_type}
                </p>
                <p className="text-sm text-gray-700 mb-1">
                  <strong>⚖ Quantity:</strong> {req.quantity}
                </p>
                {req.message && (
                  <p className="text-sm text-gray-700 mb-1">
                    <strong>💬 Message:</strong> {req.message}
                  </p>
                )}
                <p className="text-xs text-gray-500 mt-3">
                  🕓 Submitted:{" "}
                  {new Date(req.submitted_at).toLocaleString("en-GB")}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

