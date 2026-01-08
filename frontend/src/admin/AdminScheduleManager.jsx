import { useEffect, useState } from "react";
import { Plus, Edit3, Trash2, Clock, MapPin, Calendar, Filter, Search, Download, AlertCircle } from "lucide-react";

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
  const [searchTerm, setSearchTerm] = useState("");
  const [filterWard, setFilterWard] = useState("");
  const [filterWasteType, setFilterWasteType] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteScheduleId, setDeleteScheduleId] = useState(null);

  const [wasteTypes, setWasteTypes] = useState([]);
  const [collectionDays, setCollectionDays] = useState([]);
  const [wards, setWards] = useState([]);

  const token = localStorage.getItem("adminToken");

  const showMessage = (text, type = "success") => {
    setMessage(text);
    setMessageType(type);
    setTimeout(() => {
      setMessage("");
      setMessageType("");
    }, 3000);
  };

  // Load dynamic data from backend APIs
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [wasteTypesRes, collectionDaysRes, wardsRes] = await Promise.all([
          fetch("/api/waste-types/", { headers: { Authorization: `Token ${token}` } }),
          fetch("/api/collection-days/", { headers: { Authorization: `Token ${token}` } }),
          fetch("/api/wards/", { headers: { Authorization: `Token ${token}` } })
        ]);
        
        const [wasteTypesData, collectionDaysData, wardsData] = await Promise.all([
          wasteTypesRes.json(),
          collectionDaysRes.json(),
          wardsRes.json()
        ]);
        
        setWasteTypes(wasteTypesData.filter(wt => wt.is_active));
        setCollectionDays(collectionDaysData.filter(cd => cd.is_active));
        setWards(wardsData.filter(w => w.is_active));
      } catch (error) {
        console.error("Failed to fetch dynamic data:", error);
      }
    };
    
    fetchData();
  }, [token]);

  const fetchSchedule = () => {
    fetch("/api/schedule/")
      .then((res) => res.json())
      .then((data) => {
        setSchedule(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
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
        setShowForm(false);
        showMessage(editingId ? "Schedule updated successfully!" : "Schedule created successfully!");
        fetchSchedule();
      })
      .catch((err) => showMessage(err.message, "error"));
  };

  const handleEdit = (item) => {
    setFormData({
      ward: item.ward,
      collection_day: item.collection_day,
      waste_type: item.waste_type,
      time: item.time,
    });
    setEditingId(item.id);
    setShowForm(true);
  };

  const handleDelete = (id) => {
    setDeleteScheduleId(id);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = () => {
    fetch(`/api/schedule/${deleteScheduleId}/`, {
      method: "DELETE",
      headers: { Authorization: `Token ${token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to delete schedule");
        showMessage("Schedule deleted successfully!");
        fetchSchedule();
      })
      .catch((err) => showMessage(err.message, "error"))
      .finally(() => {
        setShowDeleteConfirm(false);
        setDeleteScheduleId(null);
      });
  };

  const cancelDelete = () => {
    setShowDeleteConfirm(false);
    setDeleteScheduleId(null);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setFormData({ ward: "", collection_day: "", waste_type: "", time: "" });
    setShowForm(false);
  };

  const filteredSchedule = schedule.filter(item => {
    const matchesSearch = item.collection_day.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.waste_type.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.ward.toString().includes(searchTerm);
    const matchesWard = !filterWard || item.ward.toString() === filterWard;
    const matchesWasteType = !filterWasteType || item.waste_type === filterWasteType;
    return matchesSearch && matchesWard && matchesWasteType;
  });

  const exportSchedule = () => {
    const csvContent = "data:text/csv;charset=utf-8," + 
      "Ward,Day,Waste Type,Time\n" +
      schedule.map(item => `${item.ward},${item.collection_day},${item.waste_type},${item.time}`).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "waste_collection_schedule.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getWasteTypeColor = (type) => {
    const colors = {
      "General Waste": "bg-gray-100 text-gray-800",
      "Recyclable": "bg-blue-100 text-blue-800",
      "Organic/Compost": "bg-green-100 text-green-800",
      "Hazardous": "bg-red-100 text-red-800",
      "Electronic": "bg-purple-100 text-purple-800",
      "Bulk Items": "bg-orange-100 text-orange-800"
    };
    return colors[type] || "bg-gray-100 text-gray-800";
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
        <div className={`p-4 rounded-lg border ${
          messageType === "error" 
            ? "bg-red-50 border-red-200 text-red-700" 
            : "bg-green-50 border-green-200 text-green-700"
        }`}>
          {message}
        </div>
      )}

      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Schedule Manager</h1>
            <p className="text-gray-600 mt-1">Manage waste collection schedules across all wards</p>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={exportSchedule}
              className="flex items-center space-x-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              <Download className="h-4 w-4" />
              <span>Export CSV</span>
            </button>
            <button
              onClick={() => setShowForm(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="h-4 w-4" />
              <span>Add Schedule</span>
            </button>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex items-center space-x-3">
            <div className="bg-blue-100 p-2 rounded-lg">
              <Calendar className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Schedules</p>
              <p className="text-xl font-bold text-gray-900">{schedule.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex items-center space-x-3">
            <div className="bg-green-100 p-2 rounded-lg">
              <MapPin className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Active Wards</p>
              <p className="text-xl font-bold text-gray-900">{new Set(schedule.map(s => s.ward)).size}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex items-center space-x-3">
            <div className="bg-purple-100 p-2 rounded-lg">
              <Filter className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Waste Types</p>
              <p className="text-xl font-bold text-gray-900">{new Set(schedule.map(s => s.waste_type)).size}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex items-center space-x-3">
            <div className="bg-orange-100 p-2 rounded-lg">
              <Clock className="h-5 w-5 text-orange-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Collection Days</p>
              <p className="text-xl font-bold text-gray-900">{new Set(schedule.map(s => s.collection_day)).size}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow-sm border p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search schedules..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <select
            value={filterWard}
            onChange={(e) => setFilterWard(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All Wards</option>
            {wards.map(ward => (
              <option key={ward.id} value={ward.ward_number}>Ward {ward.ward_number} - {ward.name}</option>
            ))}
          </select>
          <select
            value={filterWasteType}
            onChange={(e) => setFilterWasteType(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All Waste Types</option>
            {wasteTypes.map(type => (
              <option key={type.id} value={type.name}>{type.name}</option>
            ))}
          </select>
          <button
            onClick={() => {
              setSearchTerm("");
              setFilterWard("");
              setFilterWasteType("");
            }}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Clear Filters
          </button>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Confirm Delete</h3>
            <p className="text-gray-600 mb-6">Are you sure you want to delete this schedule? This action cannot be undone.</p>
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

      {/* Add/Edit Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {editingId ? "Edit Schedule" : "Add New Schedule"}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Ward</label>
                <select
                  name="ward"
                  value={formData.ward}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  <option value="">Select Ward</option>
                  {wards.map(ward => (
                    <option key={ward.id} value={ward.ward_number}>
                      Ward {ward.ward_number} - {ward.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Collection Day</label>
                <select
                  name="collection_day"
                  value={formData.collection_day}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  <option value="">Select Day</option>
                  {collectionDays.map(day => (
                    <option key={day.id} value={day.name}>{day.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Waste Type</label>
                <select
                  name="waste_type"
                  value={formData.waste_type}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  <option value="">Select Waste Type</option>
                  {wasteTypes.map(type => (
                    <option key={type.id} value={type.name}>{type.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Collection Time</label>
                <input
                  type="time"
                  name="time"
                  value={formData.time}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              <div className="flex space-x-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  {editingId ? "Update Schedule" : "Add Schedule"}
                </button>
                <button
                  type="button"
                  onClick={cancelEdit}
                  className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Schedule Table */}
      {filteredSchedule.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm border p-12 text-center">
          <AlertCircle className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No schedules found</h3>
          <p className="text-gray-600">No schedules match your current search and filter criteria.</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ward</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Day</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Waste Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredSchedule.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="bg-blue-100 p-2 rounded-lg mr-3">
                          <MapPin className="h-4 w-4 text-blue-600" />
                        </div>
                        <span className="text-sm font-medium text-gray-900">Ward {item.ward}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                        <span className="text-sm text-gray-900">{item.collection_day}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getWasteTypeColor(item.waste_type)}`}>
                        {item.waste_type}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 text-gray-400 mr-2" />
                        <span className="text-sm text-gray-900">{item.time}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEdit(item)}
                          className="text-blue-600 hover:text-blue-900 p-1"
                          title="Edit schedule"
                        >
                          <Edit3 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="text-red-600 hover:text-red-900 p-1"
                          title="Delete schedule"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
