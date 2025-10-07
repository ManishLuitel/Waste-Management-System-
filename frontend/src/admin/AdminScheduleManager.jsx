import { useEffect, useState } from "react";

export default function AdminScheduleManager() {
  const [formData, setFormData] = useState({
    ward: "",
    collection_day: "",
    waste_type: "",
    time: "",
  });
  const [schedule, setSchedule] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);

  const token = localStorage.getItem("token");

  // Fetch schedule
  const fetchSchedule = () => {
    fetch("/api/schedule/")
      .then((res) => res.json())
      .then((data) => {
        setSchedule(data);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchSchedule();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const method = editingId ? "PUT" : "POST";
    const url = editingId ? `/api/schedule/${editingId}/` : "/api/schedule/";

    fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${token}`,
      },
      body: JSON.stringify(formData),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to save schedule");
        return res.json();
      })
      .then(() => {
        setFormData({ ward: "", collection_day: "", waste_type: "", time: "" });
        setEditingId(null);
        fetchSchedule();
      })
      .catch((err) => alert(err));
  };

  const handleEdit = (item) => {
    setFormData({
      ward: item.ward,
      collection_day: item.collection_day,
      waste_type: item.waste_type,
      time: item.time,
    });
    setEditingId(item.id);
  };

  const handleDelete = (id) => {
    if (!window.confirm("Are you sure you want to delete this schedule?")) return;

    fetch(`/api/schedule/${id}/`, {
      method: "DELETE",
      headers: {
        Authorization: `Token ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to delete schedule");
        fetchSchedule();
      })
      .catch((err) => alert(err));
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold text-green-700 mb-4">
        📅 Admin Schedule Manager
      </h2>

      {/* Schedule Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded-lg p-4 mb-6"
      >
        <div className="grid md:grid-cols-2 gap-4">
          <input
            name="ward"
            placeholder="Ward Number"
            value={formData.ward}
            onChange={handleChange}
            className="border p-2 rounded"
            required
          />
          <input
            name="collection_day"
            placeholder="Collection Day"
            value={formData.collection_day}
            onChange={handleChange}
            className="border p-2 rounded"
            required
          />
          <input
            name="waste_type"
            placeholder="Waste Type"
            value={formData.waste_type}
            onChange={handleChange}
            className="border p-2 rounded"
            required
          />
          <input
            name="time"
            placeholder="Time"
            value={formData.time}
            onChange={handleChange}
            className="border p-2 rounded"
            required
          />
        </div>
        <button className="mt-4 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
          {editingId ? "✏️ Update Schedule" : "➕ Add Schedule"}
        </button>
        {editingId && (
          <button
            type="button"
            onClick={() => {
              setEditingId(null);
              setFormData({ ward: "", collection_day: "", waste_type: "", time: "" });
            }}
            className="mt-4 ml-2 bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
          >
            ❌ Cancel Edit
          </button>
        )}
      </form>

      {/* Schedule Table */}
      {loading ? (
        <p>Loading schedule...</p>
      ) : (
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-green-200">
              <th className="border px-4 py-2">Ward</th>
              <th className="border px-4 py-2">Day</th>
              <th className="border px-4 py-2">Waste Type</th>
              <th className="border px-4 py-2">Time</th>
              <th className="border px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {schedule.map((item) => (
              <tr key={item.id}>
                <td className="border px-4 py-2">{item.ward}</td>
                <td className="border px-4 py-2">{item.collection_day}</td>
                <td className="border px-4 py-2">{item.waste_type}</td>
                <td className="border px-4 py-2">{item.time}</td>
                <td className="border px-4 py-2 text-center">
                  <button
                    onClick={() => handleEdit(item)}
                    className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600 mr-2"
                  >
                    ✏️ Edit
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                  >
                    🗑 Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
