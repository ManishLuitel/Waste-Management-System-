import { useState } from 'react'
import axios from 'axios'

function CompostRequestForm() {
  const [formData, setFormData] = useState({
    name: '',
    contact: '',
    location: '',
    waste_type: '',
    quantity: '',
    message: '',
  })

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await axios.post('/api/compost-request/', formData)
      alert('✅ Compost request submitted!')
      setFormData({
        name: '',
        contact: '',
        location: '',
        waste_type: '',
        quantity: '',
        message: '',
      })
    } catch (error) {
      console.error('❌ Error submitting compost request:', error)
      alert('Failed to submit compost request.')
    }
  }

  return (
    <div className="min-h-screen flex justify-center items-center bg-green-50 py-10 px-4">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow-xl w-full max-w-xl">
        <h2 className="text-2xl font-bold text-green-800 mb-6 text-center">🌿 Compost Request Form</h2>

        {[
          { label: 'Name', name: 'name', type: 'text' },
          { label: 'Contact', name: 'contact', type: 'text' },
          { label: 'Location', name: 'location', type: 'text' },
          { label: 'Waste Type', name: 'waste_type', type: 'text' },
          { label: 'Quantity (e.g. 5kg)', name: 'quantity', type: 'text' }
        ].map(({ label, name, type }) => (
          <div key={name} className="mb-4">
            <label className="block mb-1 text-gray-700 font-medium">{label}</label>
            <input
              type={type}
              name={name}
              value={formData[name]}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-green-400 focus:outline-none"
              required
            />
          </div>
        ))}

        <div className="mb-6">
          <label className="block mb-1 text-gray-700 font-medium">Message (optional)</label>
          <textarea
            name="message"
            value={formData.message}
            onChange={handleChange}
            rows={3}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-green-400 focus:outline-none"
          />
        </div>

        <button type="submit" className="w-full bg-green-600 text-white font-bold py-3 rounded-lg hover:bg-green-700 transition-all">
          📤 Submit Request
        </button>
      </form>
    </div>
  )
}

export default CompostRequestForm
