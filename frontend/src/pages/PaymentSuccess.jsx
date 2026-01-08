import { CheckCircle, Home, Receipt } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useEffect } from 'react';

export default function PaymentSuccess() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = localStorage.getItem('token');

  useEffect(() => {
    // Check if this is an invoice payment and update status
    const invoiceId = searchParams.get('invoice_id');
    if (invoiceId && token) {
      updateInvoiceStatus(invoiceId);
    }
  }, [searchParams, token]);

  const updateInvoiceStatus = async (invoiceId) => {
    try {
      await fetch('http://localhost:8000/api/payments/update_invoice_status/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Token ${token}`
        },
        body: JSON.stringify({
          invoice_id: invoiceId,
          status: 'processing'
        })
      });
    } catch (error) {
      console.error('Failed to update invoice status:', error);
    }
  };

  return (
    <div className="min-h-screen bg-green-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        <div className="mb-6">
          <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Payment Successful!</h1>
          <p className="text-gray-600">Your payment has been processed successfully.</p>
        </div>

        <div className="space-y-3">
          <button
            onClick={() => navigate('/user-dashboard/payment-history')}
            className="w-full bg-green-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
          >
            <Receipt className="h-4 w-4" />
            View Payment History
          </button>
          
          <button
            onClick={() => navigate('/user-dashboard')}
            className="w-full bg-gray-100 text-gray-700 py-3 px-4 rounded-lg font-medium hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
          >
            <Home className="h-4 w-4" />
            Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}