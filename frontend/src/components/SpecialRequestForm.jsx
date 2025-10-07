import { useState } from 'react'
import axios from 'axios'

function SpecialRequestForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    address: '',
    reason: '',
    preferred_date: '',
    preferred_time: ''
  })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await axios.post('http://127.0.0.1:8000/api/special-request/', formData)
      setSuccess(true)
      setFormData({
        name: '',
        email: '',
        address: '',
        reason: '',
        preferred_date: '',
        preferred_time: ''
      })
    } catch (error) {
      console.error("Error submitting request:", error)
      alert("❌ Failed to send request.")
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-green-100 text-center p-6">
        <h2 className="text-3xl font-bold text-green-800 mb-4">🎉 Request Sent Successfully!</h2>
        <p className="mb-6 text-lg text-gray-700">We’ll get back to you soon. Thank you for keeping Banepa clean!</p>
        <button
          onClick={() => setSuccess(false)}
          className="bg-green-700 text-white px-6 py-2 rounded hover:bg-green-800"
        >
          Send Another Request
        </button>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-green-100 to-green-200 py-10 px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-lg bg-white p-8 rounded-2xl shadow-2xl transition-all"
      >
        <h2 className="text-2xl font-semibold text-green-800 mb-6 text-center">
          🗑️ Special Waste Pickup Request
        </h2>

        {[
          { label: 'Name', name: 'name', type: 'text' },
          { label: 'Email', name: 'email', type: 'email' },
          { label: 'Address', name: 'address', type: 'text' },
          { label: 'Preferred Date', name: 'preferred_date', type: 'date' },
          { label: 'Preferred Time', name: 'preferred_time', type: 'time' }
        ].map(({ label, name, type }) => (
          <div key={name} className="mb-4">
            <label className="block text-gray-700 font-medium mb-1">{label}:</label>
            <input
              type={type}
              name={name}
              value={formData[name]}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
              required
            />
          </div>
        ))}

        <div className="mb-6">
          <label className="block text-gray-700 font-medium mb-1">Reason for Request:</label>
          <textarea
            name="reason"
            value={formData.reason}
            onChange={handleChange}
            rows={4}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
            placeholder="Explain why you need this pickup..."
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-lg shadow-lg transition-all ${loading ? 'opacity-50' : ''}`}
        >
          {loading ? 'Submitting...' : '📤 Submit Request'}
        </button>
      </form>
    </div>
  )
}

export default SpecialRequestForm
