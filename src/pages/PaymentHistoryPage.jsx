import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchPaymentHistory } from '../features/payment/paymentSlice';
import Loader from '../components/common/Loader';

const statusStyles = {
  created: 'bg-amber-100 text-amber-700',
  paid: 'bg-green-100 text-green-700',
  failed: 'bg-red-100 text-red-700',
};

const formatAmount = (amount, currency) => {
  const value = (amount || 0) / 100;
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: currency || 'INR',
    maximumFractionDigits: 0,
  }).format(value);
};

const PaymentHistoryPage = () => {
  const dispatch = useDispatch();
  const { history, loading } = useSelector((state) => state.payment);

  useEffect(() => {
    dispatch(fetchPaymentHistory());
  }, [dispatch]);

  if (loading) return <Loader label="Loading payment history..." />;

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <h1 className="font-display text-2xl font-bold text-gray-900">Billing history</h1>
        <Link to="/pricing" className="btn-secondary !py-2 text-sm">
          View plans
        </Link>
      </div>

      {history.length === 0 ? (
        <div className="card flex flex-col items-center gap-3 px-6 py-16 text-center">
          <p className="text-sm text-gray-500">No payment history yet.</p>
          <Link to="/pricing" className="btn-primary">
            Explore Premium
          </Link>
        </div>
      ) : (
        <div className="card overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-gray-200 text-xs font-semibold uppercase tracking-wide text-gray-400">
              <tr>
                <th className="px-4 py-3">Receipt</th>
                <th className="px-4 py-3">Plan</th>
                <th className="px-4 py-3">Amount</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {history.map((payment) => (
                <tr key={payment._id}>
                  <td className="px-4 py-3 font-medium text-gray-900">
                    {payment.receipt || payment.razorpayOrderId}
                  </td>
                  <td className="px-4 py-3 capitalize text-gray-600">{payment.planType}</td>
                  <td className="px-4 py-3 text-gray-600">
                    {formatAmount(payment.amount, payment.currency)}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${
                        statusStyles[payment.status] || statusStyles.created
                      }`}
                    >
                      {payment.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-500">
                    {payment.createdAt
                      ? new Date(payment.createdAt).toLocaleDateString('en-IN', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric',
                        })
                      : '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default PaymentHistoryPage;
