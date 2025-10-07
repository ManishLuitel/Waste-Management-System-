import { useState } from 'react'
import axios from 'axios'

export default function ScheduleForm({ onSuccess }) {
  const [formData, setFormData] = useState({
    ward: '',
    collection_day: '',
    waste_type: '',
    time: '',
  })
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await axios.post('http://localhost:8000/api/schedule/', formData)
      alert('✅ Schedule successfully added!')
      setFormData({
        ward: '',
        collection_day: '',
        waste_type: '',
        time: '',
      })
      onSuccess?.()
    } catch (err) {
      console.error('Error posting schedule:', err)
      alert('❌ Failed to submit schedule.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-xl shadow-lg p-6 w-full max-w-xl mx-auto my-10 space-y-4 border border-gray-200"
    >
      <h2 className="text-2xl font-semibold text-green-700 text-center">
        🗓️ Add Waste Collection Schedule
      </h2>

      <input
        type="number"
        name="ward"
        placeholder="Ward Number"
        value={formData.ward}
        onChange={handleChange}
        required
        className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-green-400"
      />

      <select
        name="collection_day"
        value={formData.collection_day}
        onChange={handleChange}
        required
        className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-green-400"
      >
        <option value="">Select Collection Day</option>
        {['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map((day) => (
          <option key={day} value={day}>{day}</option>
        ))}
      </select>

      <select
        name="waste_type"
        value={formData.waste_type}
        onChange={handleChange}
        required
        className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-green-400"
      >
        <option value="">Select Waste Type</option>
        {['organic', 'plastic', 'glass', 'metal'].map((type) => (
          <option key={type} value={type}>{type}</option>
        ))}
      </select>

      <input
        type="time"
        name="time"
        value={formData.time}
        onChange={handleChange}
        required
        className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-green-400"
      />

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-green-600 text-white font-semibold py-2 rounded hover:bg-green-700 transition"
      >
        {loading ? 'Submitting...' : 'Submit Schedule'}
      </button>
    </form>
  )
}
