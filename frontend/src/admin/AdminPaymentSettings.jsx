import { useState, useEffect } from 'react';
import { Settings, Save } from 'lucide-react';

export default function AdminPaymentSettings() {
  const [settings, setSettings] = useState({
    monthly_fee: '',
    per_kg_rate: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const token = localStorage.getItem('adminToken');

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/admin/payments/payment_settings/', {
        headers: { Authorization: `Token ${token}` }
      });
      
      const data = await response.json();
      setSettings(data);
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch settings:', error);
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage('');
    
    try {
      const response = await fetch('http://localhost:8000/api/admin/payments/payment_settings/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Token ${token}`
        },
        body: JSON.stringify(settings)
      });

      const data = await response.json();
      
      if (response.ok) {
        setMessage('Settings updated successfully!');
        setMessageType('success');
      } else {
        setMessage('Failed to update settings');
        setMessageType('error');
      }
    } catch (error) {
      setMessage('Failed to update settings');
      setMessageType('error');
    } finally {
      setSaving(false);
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const handleChange = (e) => {
    setSettings({
      ...settings,
      [e.target.name]: e.target.value
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Message */}
      {message && (
        <div className={`p-4 rounded-lg border ${
          messageType === 'error' 
            ? 'bg-red-50 border-red-200 text-red-700' 
            : 'bg-green-50 border-green-200 text-green-700'
        }`}>
          {message}
        </div>
      )}

      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-blue-100 p-2 rounded-lg">
            <Settings className="h-6 w-6 text-blue-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800">Payment Settings</h1>
        </div>
        <p className="text-gray-600">Configure payment amounts and rates</p>
      </div>

      {/* Settings Form */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Monthly Fee (NPR)
            </label>
            <input
              type="number"
              name="monthly_fee"
              value={settings.monthly_fee}
              onChange={handleChange}
              step="0.01"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="500.00"
            />
            <p className="text-sm text-gray-500 mt-1">
              Monthly subscription fee for waste management services
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Per KG Rate (NPR)
            </label>
            <input
              type="number"
              name="per_kg_rate"
              value={settings.per_kg_rate}
              onChange={handleChange}
              step="0.01"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="50.00"
            />
            <p className="text-sm text-gray-500 mt-1">
              Rate per kilogram for special waste collection
            </p>
          </div>
        </div>

        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h3 className="font-medium text-blue-900 mb-2">Pricing Information:</h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Monthly fee covers regular waste collection services</li>
            <li>• Per KG rate applies to special waste pickup requests</li>
            <li>• Invoices are generated automatically for approved special requests</li>
            <li>• All payments are processed through eSewa</li>
          </ul>
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className={`mt-6 bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center gap-2 ${
            saving ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          {saving ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              Saving...
            </>
          ) : (
            <>
              <Save className="h-4 w-4" />
              Save Settings
            </>
          )}
        </button>
      </div>
    </div>
  );
}