// Shown when Razorpay reports a failed payment (card declined, UPI
// timeout, insufficient funds, etc). Gives the person a clear summary
// and a way to retry instead of a toast that vanishes in a few seconds.

const PaymentFailedModal = ({ isOpen, onClose, onRetry, errorDetails }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-sm rounded-2xl bg-white p-6 text-center shadow-xl">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-100 text-2xl">
          ✕
        </div>
        <h2 className="mt-4 font-display text-lg font-bold text-gray-900">
          Payment failed
        </h2>
        <p className="mt-2 text-sm text-gray-500">
          {errorDetails?.description ||
            'Your payment could not be completed. No amount has been charged.'}
        </p>

        {errorDetails?.reason && (
          <p className="mt-3 rounded-lg bg-gray-50 px-3 py-2 text-xs text-gray-400">
            Reason: {errorDetails.reason.replace(/_/g, ' ')}
          </p>
        )}

        <div className="mt-6 flex gap-3">
          <button onClick={onClose} className="btn-secondary flex-1">
            Cancel
          </button>
          <button onClick={onRetry} className="btn-primary flex-1">
            Try again
          </button>
        </div>

        <p className="mt-4 text-xs text-gray-400">
          If money was deducted from your account, it will be refunded
          automatically within 5-7 business days.
        </p>
      </div>
    </div>
  );
};

export default PaymentFailedModal;
