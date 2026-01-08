import { useState, useEffect } from 'react';
import { CreditCard, Calendar } from 'lucide-react';

export default function MonthlyPayment() {
  const [amount, setAmount] = useState('500');
  const [selectedMonth, setSelectedMonth] = useState('');
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem('token');

  useEffect(() => {
    const currentDate = new Date();
    const currentMonth = currentDate.toISOString().slice(0, 7);
    setSelectedMonth(currentMonth);
    fetchPaymentSettings();
  }, []);

  const fetchPaymentSettings = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/payments/payment_settings/', {
        headers: { Authorization: `Token ${token}` }
      });
      const data = await response.json();
      setAmount(data.monthly_fee || '500');
    } catch (error) {
      console.error('Failed to fetch payment settings:', error);
      setAmount('500'); // fallback
    }
  };

  const handlePayment = async () => {
    setLoading(true);
    
    try {
      const response = await fetch('http://localhost:8000/api/payments/create_monthly_payment/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Token ${token}`
        },
        body: JSON.stringify({
          month: selectedMonth + '-01'
        })
      });

      const data = await response.json();
      
      if (response.ok) {
        // Create eSewa payment form
        const form = document.createElement('form');
        form.method = 'POST';
        form.action = 'https://rc-epay.esewa.com.np/api/epay/main/v2/form';

        const fields = {
          amount: data.amount,
          tax_amount: '0',
          total_amount: data.amount,
          transaction_uuid: data.transaction_uuid,
          product_code: data.product_code,
          product_service_charge: '0',
          product_delivery_charge: '0',
          success_url: `${window.location.origin}/payment-success`,
          failure_url: `${window.location.origin}/payment-failure`,
          signed_field_names: 'total_amount,transaction_uuid,product_code',
          signature: data.signature
        };

        Object.keys(fields).forEach(key => {
          const input = document.createElement('input');
          input.type = 'hidden';
          input.name = key;
          input.value = fields[key];
          form.appendChild(input);
        });

        document.body.appendChild(form);
        form.submit();
      }
    } catch (error) {
      console.error('Payment error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-green-100 p-2 rounded-lg">
            <CreditCard className="h-6 w-6 text-green-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800">Monthly Payment</h1>
        </div>
        <p className="text-gray-600">Pay your monthly waste management fee</p>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Calendar className="inline h-4 w-4 mr-1" />
              Select Month
            </label>
            <input
              type="month"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Amount (NPR)
            </label>
            <input
              type="text"
              value={amount}
              readOnly
              className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
            />
          </div>
        </div>

        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h3 className="font-medium text-blue-900 mb-2">Payment Details:</h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Monthly waste collection service</li>
            <li>• Includes regular pickup schedule</li>
            <li>• 24/7 customer support</li>
            <li>• Environmental impact reporting</li>
          </ul>
        </div>

        <button
          onClick={handlePayment}
          disabled={loading || !selectedMonth}
          className={`w-full mt-6 bg-green-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center justify-center gap-2 ${
            loading ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          {loading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              Processing...
            </>
          ) : (
            <>
              <CreditCard className="h-4 w-4" />
              Pay with eSewa
            </>
          )}
        </button>
      </div>
    </div>
  );
}