import { useEffect, useState } from "react";
import { Calendar, MapPin, Clock, Trash2 } from "lucide-react";

export default function ScheduleViewer() {
  const [schedule, setSchedule] = useState([]);
  const [wards, setWards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedWard, setSelectedWard] = useState("all");
  const [selectedDay, setSelectedDay] = useState("all");

  useEffect(() => {
    // Fetch both schedule and wards data
    Promise.all([
      fetch("http://127.0.0.1:8000/api/schedule/"),
      fetch("http://127.0.0.1:8000/api/wards/")
    ])
      .then(([scheduleRes, wardsRes]) => {
        if (!scheduleRes.ok || !wardsRes.ok) {
          throw new Error(`Server error`);
        }
        return Promise.all([scheduleRes.json(), wardsRes.json()]);
      })
      .then(([scheduleData, wardsData]) => {
        console.log("✅ Fetched schedule:", scheduleData);
        console.log("✅ Fetched wards:", wardsData);
        setSchedule(Array.isArray(scheduleData) ? scheduleData : []);
        setWards(Array.isArray(wardsData) ? wardsData : []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("❌ Failed to fetch data:", err);
        setError("Unable to load schedule. Please try again later.");
        setLoading(false);
      });
  }, []);

  const getWardName = (wardNumber) => {
    const ward = wards.find(w => w.ward_number === wardNumber);
    return ward ? ward.name : `Ward ${wardNumber}`;
  };

  const getWasteTypeColor = (type) => {
    const colors = {
      "General Waste": "bg-gray-100 text-gray-800 border-gray-300",
      "Recyclable": "bg-blue-100 text-blue-800 border-blue-300",
      "Organic/Compost": "bg-green-100 text-green-800 border-green-300",
      "Hazardous": "bg-red-100 text-red-800 border-red-300",
      "Electronic": "bg-purple-100 text-purple-800 border-purple-300",
      "Bulk Items": "bg-orange-100 text-orange-800 border-orange-300"
    };
    return colors[type] || "bg-gray-100 text-gray-800 border-gray-300";
  };

  const filteredSchedule = schedule.filter(item => {
    const wardMatch = selectedWard === "all" || item.ward.toString() === selectedWard;
    const dayMatch = selectedDay === "all" || item.collection_day === selectedDay;
    return wardMatch && dayMatch;
  });

  const uniqueWards = [...new Set(schedule.map(item => item.ward))].sort((a, b) => a - b);
  const uniqueDays = [...new Set(schedule.map(item => item.collection_day))];

  if (loading) {
    return (
      <div className="min-h-screen bg-green-50 py-8">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-green-50 py-8">
        <div className="max-w-6xl mx-auto px-4">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <p className="text-red-700">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-green-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-800 mb-2 flex items-center justify-center gap-2">
              <Calendar className="h-8 w-8 text-green-600" />
              Weekly Waste Collection Schedule
            </h1>
            <p className="text-gray-600">Find your ward's collection schedule and waste types</p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-48">
              <label className="block text-sm font-medium text-gray-700 mb-1">Filter by Ward</label>
              <select
                value={selectedWard}
                onChange={(e) => setSelectedWard(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="all">All Wards</option>
                {uniqueWards.map(ward => (
                  <option key={ward} value={ward}>Ward {ward}</option>
                ))}
              </select>
            </div>
            <div className="flex-1 min-w-48">
              <label className="block text-sm font-medium text-gray-700 mb-1">Filter by Day</label>
              <select
                value={selectedDay}
                onChange={(e) => setSelectedDay(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="all">All Days</option>
                {uniqueDays.map(day => (
                  <option key={day} value={day}>{day}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Schedule Cards */}
        {filteredSchedule.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredSchedule.map((item) => (
              <div key={item.id} className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <div className="bg-green-100 p-2 rounded-lg">
                        <MapPin className="h-5 w-5 text-green-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">Ward {item.ward}</h3>
                        <p className="text-xs text-gray-500">{getWardName(item.ward)}</p>
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getWasteTypeColor(item.waste_type)}`}>
                      {item.waste_type}
                    </span>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Calendar className="h-4 w-4" />
                      <span className="font-medium">{item.collection_day}</span>
                    </div>
                    
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Clock className="h-4 w-4" />
                      <span>{item.time}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <Trash2 className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No schedules found</h3>
            <p className="text-gray-600">
              {selectedWard !== "all" || selectedDay !== "all" 
                ? "No schedules match your current filters." 
                : "No collection schedules are available at the moment."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
