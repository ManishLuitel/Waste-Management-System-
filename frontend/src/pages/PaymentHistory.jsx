import { useState, useEffect } from 'react';
import { History, Calendar, FileText, CheckCircle } from 'lucide-react';

export default function PaymentHistory() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchPaymentHistory();
  }, []);

  const fetchPaymentHistory = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/payments/payment_history/', {
        headers: { Authorization: `Token ${token}` }
      });
      
      const data = await response.json();
      // Only show completed/paid payments
      const completedPayments = (data.payments || []).filter(p => p.status === 'completed');
      const paidInvoices = (data.invoices || []).filter(i => i.status === 'paid');
      setPayments([...completedPayments, ...paidInvoices]);
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch payment history:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-blue-100 p-2 rounded-lg">
            <History className="h-6 w-6 text-blue-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800">Payment History</h1>
        </div>
        <p className="text-gray-600">View your completed payment transactions</p>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6">
        {payments.length === 0 ? (
          <div className="text-center py-12">
            <History className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No payment history</h3>
            <p className="text-gray-600">You haven't completed any payments yet.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {payments.map((payment) => (
              <div key={`${payment.type}-${payment.id}`} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    {payment.type === 'monthly' ? (
                      <>
                        <Calendar className="h-4 w-4 text-gray-500" />
                        <span className="font-medium">
                          {new Date(payment.month).toLocaleDateString('en-US', { 
                            year: 'numeric', 
                            month: 'long' 
                          })}
                        </span>
                      </>
                    ) : (
                      <>
                        <FileText className="h-4 w-4 text-gray-500" />
                        <div>
                          <span className="font-medium">Special Request Invoice</span>
                          <p className="text-xs text-gray-500">{payment.special_request_name}</p>
                        </div>
                      </>
                    )}
                  </div>
                  <span className="px-3 py-1 rounded-full text-xs font-medium border bg-green-100 text-green-800 border-green-200 flex items-center gap-1">
                    <CheckCircle className="h-3 w-3" />
                    {payment.type === 'monthly' ? 'Completed' : 'Paid'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-gray-900">NPR {payment.amount}</span>
                  <span className="text-sm text-gray-500">
                    {new Date(payment.created_at).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}