import { useState, useEffect } from 'react'
import { Calendar, Clock, MapPin, User, MessageSquare, Truck } from 'lucide-react'
import axios from 'axios'
import LocationPicker from './LocationPicker'

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
    setFormData({ ...formData, address: coordinates })
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')
    
    try {
      await axios.post('http://127.0.0.1:8000/api/special-request/', formData, {
        headers: { Authorization: `Token ${token}` }
      })
      setMessage('Special waste pickup request submitted successfully! We will review your request and contact you soon.')
      setMessageType('success')
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
      setMessage('Failed to submit request. Please try again.')
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
                <Truck className="h-8 w-8 text-green-600" />
              </div>
              <h1 className="text-3xl font-bold text-gray-800">Special Waste Pickup Request</h1>
            </div>
            <p className="text-gray-600 max-w-lg mx-auto">
              Request special collection for items that require separate handling or don't fit regular collection schedules.
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
                  <User className="inline h-4 w-4 mr-1" />
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
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <MapPin className="inline h-4 w-4 mr-1" />
                Pickup Address
              </label>
              <div className="space-y-3">
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Enter complete pickup address with landmarks or select from map"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowMap(!showMap)}
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
                      selectedLocation={formData.address}
                    />
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Calendar className="inline h-4 w-4 mr-1" />
                  Preferred Date
                </label>
                <input
                  type="date"
                  name="preferred_date"
                  value={formData.preferred_date}
                  onChange={handleChange}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Clock className="inline h-4 w-4 mr-1" />
                  Preferred Time
                </label>
                <input
                  type="time"
                  name="preferred_time"
                  value={formData.preferred_time}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <MessageSquare className="inline h-4 w-4 mr-1" />
                Request Details
              </label>
              <textarea
                name="reason"
                value={formData.reason}
                onChange={handleChange}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Please describe the type of waste, quantity, and reason for special pickup (e.g., bulk items, hazardous materials, electronic waste, etc.)"
                required
              />
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-medium text-blue-900 mb-2">Important Notes:</h3>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Special pickup requests are subject to approval</li>
                <li>• Additional charges may apply for certain waste types</li>
                <li>• Hazardous materials require special handling procedures</li>
                <li>• We will contact you within 24-48 hours to confirm</li>
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
                  <Truck className="h-4 w-4" />
                  Submit Pickup Request
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default SpecialRequestForm