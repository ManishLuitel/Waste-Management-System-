import { useEffect, useState } from "react";

export default function ScheduleViewer() {
  const [schedule, setSchedule] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/schedule/")
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Server error: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        console.log("✅ Fetched schedule:", data);
        setSchedule(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("❌ Failed to fetch schedule:", err);
        setError("Unable to load schedule. Please try again later.");
        setLoading(false);
      });
  }, []);

  // 🌀 Loading state
  if (loading) {
    return (
      <p className="text-center text-gray-600 mt-10 animate-pulse">
        ⏳ Loading schedule...
      </p>
    );
  }

  // ❌ Error state
  if (error) {
    return (
      <p className="text-center text-red-500 mt-10 bg-red-50 py-3 rounded">
        {error}
      </p>
    );
  }

  // 📅 Render table
  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h2 className="text-3xl font-bold text-green-700 mb-6 text-center">
        🗓 Weekly Waste Collection Schedule
      </h2>

      <div className="overflow-x-auto bg-white rounded-xl shadow-lg border border-gray-200">
        <table className="min-w-full text-left text-gray-800">
          <thead className="bg-green-100 text-green-900 uppercase text-sm">
            <tr>
              <th className="py-3 px-4 border-b">Ward</th>
              <th className="py-3 px-4 border-b">Day</th>
              <th className="py-3 px-4 border-b">Type</th>
              <th className="py-3 px-4 border-b">Time</th>
            </tr>
          </thead>
          <tbody>
            {schedule.length > 0 ? (
              schedule.map((item) => (
                <tr
                  key={item.id}
                  className="hover:bg-green-50 transition-colors duration-200"
                >
                  <td className="py-2 px-4 border-b">{item.ward}</td>
                  <td className="py-2 px-4 border-b">{item.collection_day}</td>
                  <td className="py-2 px-4 border-b capitalize">
                    {item.waste_type}
                  </td>
                  <td className="py-2 px-4 border-b">{item.time}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="4"
                  className="text-center text-gray-500 py-6 italic"
                >
                  No schedules available at the moment.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
