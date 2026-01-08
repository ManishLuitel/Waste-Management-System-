import { useState, useEffect } from 'react'
import { Leaf, Recycle, Heart, Sprout, MapPin } from 'lucide-react'
import axios from 'axios'
import LocationPicker from './LocationPicker'

function CompostRequestForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    contact: '',
    location: '',
    waste_type: '',
    quantity: '',
    message: '',
  })
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [messageType, setMessageType] = useState('')
  const [showMap, setShowMap] = useState(false)

  const token = localStorage.getItem('token')

  useEffect(() => {
    // Set user email from localStorage
    const userEmail = localStorage.getItem('userEmail')
    if (userEmail) {
      setFormData(prev => ({ ...prev, email: userEmail }))
    }
  }, [])

  const handleLocationSelect = (coordinates) => {
    setFormData({ ...formData, location: coordinates })
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')
    
    try {
      await axios.post('http://127.0.0.1:8000/api/compost-request/', formData, {
        headers: { Authorization: `Token ${token}` }
      })
      setMessage('Compost request submitted successfully! Together we\'re creating a greener future.')
      setMessageType('success')
      setFormData({
        name: '',
        email: '',
        contact: '',
        location: '',
        waste_type: '',
        quantity: '',
        message: '',
      })
    } catch (error) {
      console.error('Error submitting compost request:', error)
      setMessage('Failed to submit compost request. Please try again.')
      setMessageType('error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-green-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="bg-green-100 p-3 rounded-full">
                <Leaf className="h-8 w-8 text-green-600" />
              </div>
              <h1 className="text-3xl font-bold text-gray-800">Compost Request Form</h1>
            </div>
            <p className="text-gray-600 max-w-lg mx-auto">
              Turn your organic waste into valuable compost and contribute to a sustainable environment.
            </p>
          </div>
        </div>

        {/* Message */}
        {message && (
          <div className={`mb-6 p-4 rounded-lg border ${
            messageType === 'error' 
              ? 'bg-red-50 border-red-200 text-red-700' 
              : 'bg-green-50 border-green-200 text-green-700'
          }`}>
            {message}
          </div>
        )}

        {/* Form */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Enter your full name"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address (Auto-filled)
                </label>
                <input
                  type="email"
                  value={formData.email}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-600"
                  disabled
                  readOnly
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Contact Number
                </label>
                <input
                  type="text"
                  name="contact"
                  value={formData.contact}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Enter your contact number"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Waste Type
                </label>
                <input
                  type="text"
                  name="waste_type"
                  value={formData.waste_type}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Enter your waste type"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Quantity (e.g. 5kg)
                </label>
                <input
                  type="text"
                  name="quantity"
                  value={formData.quantity}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Enter your quantity (e.g. 5kg)"
                  required
                />
              </div>
            </div>

            {/* Location Field with Map */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Location
              </label>
              <div className="space-y-3">
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Enter address or select from map"
                  required
                />
                <button
                  type="button"
                  onClick={() => {
                    console.log('Map button clicked, showMap:', showMap);
                    setShowMap(!showMap);
                  }}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
                >
                  <MapPin className="h-4 w-4" />
                  {showMap ? 'Hide Map' : 'Select from Map'}
                </button>
                {showMap && (
                  <div className="border-2 border-blue-300 p-4 rounded-lg">
                    <p className="text-sm text-gray-600 mb-2">Map loading...</p>
                    <LocationPicker 
                      onLocationSelect={handleLocationSelect}
                      selectedLocation={formData.location}
                    />
                  </div>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Additional Message (optional)
              </label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Any special instructions or additional information..."
              />
            </div>

            <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
              <h3 className="font-medium text-emerald-900 mb-2 flex items-center gap-2">
                <Recycle className="h-4 w-4" />
                Compost Benefits:
              </h3>
              <ul className="text-sm text-emerald-800 space-y-1">
                <li>• Reduces landfill waste and methane emissions</li>
                <li>• Creates nutrient-rich soil amendment</li>
                <li>• Supports sustainable gardening practices</li>
                <li>• Helps build a circular economy</li>
              </ul>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full bg-green-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center justify-center gap-2 ${
                loading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Submitting Request...
                </>
              ) : (
                <>
                  <Sprout className="h-4 w-4" />
                  Submit Compost Request
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default CompostRequestForm
