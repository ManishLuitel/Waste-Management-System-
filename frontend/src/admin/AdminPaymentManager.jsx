import { useState, useEffect } from 'react';
import { CreditCard, CheckCircle, Clock, XCircle, User, Calendar } from 'lucide-react';

export default function AdminPaymentManager() {
  const [payments, setPayments] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('monthly');
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const token = localStorage.getItem('adminToken');

  const showMessage = (text, type = 'success') => {
    setMessage(text);
    setMessageType(type);
    setTimeout(() => {
      setMessage('');
      setMessageType('');
    }, 3000);
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      const response = await fetch('/api/admin/payments/all_payments/', {
        headers: { Authorization: `Token ${token}` }
      });
      const data = await response.json();
      setPayments(data.payments || []);
      setInvoices(data.invoices || []);
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch payments:', error);
      setLoading(false);
    }
  };

  const updatePaymentStatus = async (paymentId, status, type) => {
    try {
      const response = await fetch('/api/admin/payments/update_status/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Token ${token}`
        },
        body: JSON.stringify({
          payment_id: paymentId,
          status: status,
          payment_type: type
        })
      });

      if (response.ok) {
        showMessage(`Payment status updated to ${status}`);
        fetchPayments();
      } else {
        throw new Error('Failed to update status');
      }
    } catch (error) {
      showMessage(error.message, 'error');
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
      case 'paid':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'processing':
        return <Clock className="h-4 w-4 text-blue-600" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-600" />;
      case 'failed':
        return <XCircle className="h-4 w-4 text-red-600" />;
      default:
        return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
      case 'paid':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'processing':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'failed':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
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
            <CreditCard className="h-6 w-6 text-blue-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800">Payment Management</h1>
        </div>
        <p className="text-gray-600">Manage all payment transactions and invoices</p>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-sm">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            <button
              onClick={() => setActiveTab('monthly')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'monthly'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Monthly Payments ({payments.length})
            </button>
            <button
              onClick={() => setActiveTab('invoices')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'invoices'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Invoices ({invoices.length})
            </button>
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'monthly' && (
            <div className="space-y-4">
              {payments.map((payment) => (
                <div key={payment.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <User className="h-4 w-4 text-gray-500" />
                      <span className="font-medium">{payment.user_email}</span>
                      <Calendar className="h-4 w-4 text-gray-500" />
                      <span className="text-sm text-gray-600">
                        {new Date(payment.month).toLocaleDateString('en-US', { 
                          year: 'numeric', 
                          month: 'long' 
                        })}
                      </span>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(payment.status)} flex items-center gap-1`}>
                      {getStatusIcon(payment.status)}
                      {payment.status}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xl font-bold text-gray-900">NPR {payment.amount}</span>
                    <div className="flex space-x-2">
                      {payment.status === 'pending' && (
                        <>
                          <button
                            onClick={() => updatePaymentStatus(payment.id, 'completed', 'monthly')}
                            className="px-3 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700"
                          >
                            Mark Completed
                          </button>
                          <button
                            onClick={() => updatePaymentStatus(payment.id, 'failed', 'monthly')}
                            className="px-3 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700"
                          >
                            Mark Failed
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'invoices' && (
            <div className="space-y-4">
              {invoices.map((invoice) => (
                <div key={invoice.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <User className="h-4 w-4 text-gray-500" />
                      <div>
                        <span className="font-medium">{invoice.user_name}</span>
                        <p className="text-xs text-gray-500">{invoice.user_email}</p>
                      </div>
                      <span className="text-sm text-gray-600">{invoice.weight_kg} kg</span>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(invoice.status)} flex items-center gap-1`}>
                      {getStatusIcon(invoice.status)}
                      {invoice.status}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xl font-bold text-gray-900">NPR {invoice.amount}</span>
                    <div className="flex space-x-2">
                      {invoice.status === 'pending' && (
                        <button
                          onClick={() => updatePaymentStatus(invoice.id, 'paid', 'invoice')}
                          className="px-3 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700"
                        >
                          Mark Paid
                        </button>
                      )}
                      {invoice.status === 'processing' && (
                        <button
                          onClick={() => updatePaymentStatus(invoice.id, 'paid', 'invoice')}
                          className="px-3 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700"
                        >
                          Verify Payment
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}