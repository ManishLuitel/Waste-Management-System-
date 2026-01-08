import { useState, useEffect } from "react";
import { Plus, Edit3, Trash2, Palette, AlertCircle } from "lucide-react";

export default function WasteTypeManager() {
  const [wasteTypes, setWasteTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteTypeId, setDeleteTypeId] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    color_code: "#6B7280"
  });

  const token = localStorage.getItem("adminToken");
  const predefinedColors = [
    "#6B7280", "#EF4444", "#10B981", "#3B82F6", 
    "#8B5CF6", "#F59E0B", "#EC4899", "#14B8A6"
  ];

  const showMessage = (text, type = "success") => {
    setMessage(text);
    setMessageType(type);
    setTimeout(() => {
      setMessage("");
      setMessageType("");
    }, 3000);
  };

  const fetchWasteTypes = () => {
    fetch("/api/waste-types/", {
      headers: { Authorization: `Token ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        setWasteTypes(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    fetchWasteTypes();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const method = editingId ? "PUT" : "POST";
    const url = editingId ? `/api/waste-types/${editingId}/` : "/api/waste-types/";

    fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${token}`
      },
      body: JSON.stringify(formData)
    })
      .then(res => {
        if (!res.ok) throw new Error("Failed to save waste type");
        return res.json();
      })
      .then(() => {
        setFormData({ name: "", description: "", color_code: "#6B7280" });
        setEditingId(null);
        setShowForm(false);
        showMessage(editingId ? "Waste type updated successfully!" : "Waste type created successfully!");
        fetchWasteTypes();
      })
      .catch(err => showMessage(err.message, "error"));
  };

  const handleEdit = (type) => {
    setFormData({
      name: type.name,
      description: type.description,
      color_code: type.color_code
    });
    setEditingId(type.id);
    setShowForm(true);
  };

  const handleDelete = (id) => {
    setDeleteTypeId(id);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = () => {
    fetch(`/api/waste-types/${deleteTypeId}/`, {
      method: "DELETE",
      headers: { Authorization: `Token ${token}` }
    })
      .then(res => {
        if (!res.ok) throw new Error("Failed to delete waste type");
        showMessage("Waste type deleted successfully!");
        fetchWasteTypes();
      })
      .catch(err => showMessage(err.message, "error"))
      .finally(() => {
        setShowDeleteConfirm(false);
        setDeleteTypeId(null);
      });
  };

  const cancelDelete = () => {
    setShowDeleteConfirm(false);
    setDeleteTypeId(null);
  };

  const cancelEdit = () => {
    setFormData({ name: "", description: "", color_code: "#6B7280" });
    setEditingId(null);
    setShowForm(false);
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
            <h1 className="text-2xl font-bold text-gray-900">Waste Type Manager</h1>
            <p className="text-gray-600 mt-1">Manage waste types and their properties</p>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="h-4 w-4" />
            <span>Add Waste Type</span>
          </button>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Confirm Delete</h3>
            <p className="text-gray-600 mb-6">Are you sure you want to delete this waste type? This action cannot be undone.</p>
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

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {editingId ? "Edit Waste Type" : "Add New Waste Type"}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows="3"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Color</label>
                <div className="flex space-x-2 mb-2">
                  {predefinedColors.map(color => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setFormData({...formData, color_code: color})}
                      className={`w-8 h-8 rounded-full border-2 ${formData.color_code === color ? 'border-gray-800' : 'border-gray-300'}`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
                <input
                  type="color"
                  value={formData.color_code}
                  onChange={(e) => setFormData({...formData, color_code: e.target.value})}
                  className="w-full h-10 border border-gray-300 rounded-lg"
                />
              </div>
              <div className="flex space-x-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  {editingId ? "Update" : "Add"} Waste Type
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

      {/* Waste Types Grid */}
      {wasteTypes.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm border p-12 text-center">
          <AlertCircle className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No waste types found</h3>
          <p className="text-gray-600">Add your first waste type to get started.</p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {wasteTypes.map((type) => (
            <div key={type.id} className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow">
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div 
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: type.color_code }}
                    />
                    <h3 className="font-semibold text-gray-900">{type.name}</h3>
                  </div>
                  <div className="flex space-x-1">
                    <button
                      onClick={() => handleEdit(type)}
                      className="text-blue-600 hover:text-blue-900 p-1"
                      title="Edit waste type"
                    >
                      <Edit3 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(type.id)}
                      className="text-red-600 hover:text-red-900 p-1"
                      title="Delete waste type"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                {type.description && (
                  <p className="text-sm text-gray-600">{type.description}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}