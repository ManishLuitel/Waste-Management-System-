import { useState, useEffect } from 'react';
import { FileText, Calendar, CreditCard, CheckCircle, Clock } from 'lucide-react';

export default function UserInvoices() {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [payingInvoice, setPayingInvoice] = useState(null);
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchInvoices();
  }, []);

  const fetchInvoices = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/payments/payment_history/', {
        headers: { Authorization: `Token ${token}` }
      });
      
      const data = await response.json();
      setInvoices(data.invoices || []);
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch invoices:', error);
      setLoading(false);
    }
  };

  const handleInvoicePayment = async (invoice) => {
    setPayingInvoice(invoice.id);
    
    try {
      const response = await fetch('http://localhost:8000/api/payments/create_invoice_payment/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Token ${token}`
        },
        body: JSON.stringify({
          invoice_id: invoice.id
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
          success_url: `${window.location.origin}/payment-success?invoice_id=${invoice.id}`,
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
      } else {
        if (data.error === 'Payment is done, manual verification in progress') {
          // Refresh the page to update the invoice status
          window.location.reload();
        } else {
          alert(data.error || 'Payment failed');
        }
      }
    } catch (error) {
      console.error('Payment error:', error);
    } finally {
      setPayingInvoice(null);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'paid':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'processing':
        return <Clock className="h-4 w-4 text-blue-600" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-600" />;
      default:
        return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'processing':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
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
            <FileText className="h-6 w-6 text-blue-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800">My Invoices</h1>
        </div>
        <p className="text-gray-600">View and pay your special request invoices</p>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6">
        {invoices.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No invoices</h3>
            <p className="text-gray-600">You don't have any special request invoices yet.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {invoices.map((invoice) => (
              <div key={invoice.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-gray-500" />
                    <div>
                      <span className="font-medium">Special Request Invoice</span>
                      <p className="text-xs text-gray-500">{invoice.special_request_name}</p>
                      <p className="text-xs text-gray-400">{invoice.special_request_address}</p>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(invoice.status)} flex items-center gap-1`}>
                    {getStatusIcon(invoice.status)}
                    {invoice.status}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-2xl font-bold text-gray-900">NPR {invoice.amount}</span>
                    <p className="text-sm text-gray-500">{invoice.weight_kg} kg</p>
                  </div>
                  <div className="text-right">
                    <span className="text-sm text-gray-500">
                      {new Date(invoice.created_at).toLocaleDateString()}
                    </span>
                    {invoice.status === 'pending' && (
                      <button
                        onClick={() => handleInvoicePayment(invoice)}
                        disabled={payingInvoice === invoice.id}
                        className={`mt-2 w-full bg-blue-600 text-white py-2 px-3 rounded text-sm font-medium hover:bg-blue-700 transition-colors ${
                          payingInvoice === invoice.id ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                      >
                        {payingInvoice === invoice.id ? 'Processing...' : 'Pay Invoice'}
                      </button>
                    )}
                    {invoice.status === 'processing' && (
                      <div className="mt-2 w-full bg-blue-50 border border-blue-200 text-blue-700 py-2 px-3 rounded text-sm text-center">
                        Manual verification pending
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}