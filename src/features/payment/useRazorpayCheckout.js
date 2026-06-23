import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { createOrder, confirmPayment, fetchPaymentHistory } from './paymentSlice';
import { getProfile } from '../auth/authSlice';
import { loadRazorpayScript, RAZORPAY_KEY_ID } from '../../utils/razorpay';

// Shared Razorpay checkout flow, usable from the Pricing page or the
// in-editor "Change Theme" upgrade banner.
//
// `failure` is exposed (not just a toast) so pages can show a proper
// PaymentFailedModal with a retry action instead of a message that
// disappears in a few seconds.
export const useRazorpayCheckout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const [processing, setProcessing] = useState(false);
  const [failure, setFailure] = useState(null); // { description, reason } | null

  const clearFailure = () => setFailure(null);

  const startCheckout = async ({ planType, planLabel, onSuccess }) => {
    setFailure(null);

    // Check configuration BEFORE creating a backend order, so we don't
    // create dead "created" payment records every time someone clicks
    // Upgrade while the key isn't set up yet.
    if (!RAZORPAY_KEY_ID) {
      console.error(
        '[Razorpay] VITE_RAZORPAY_KEY_ID is missing or empty. ' +
          'Checked import.meta.env.VITE_RAZORPAY_KEY_ID =',
        import.meta.env.VITE_RAZORPAY_KEY_ID
      );
      toast.error(
        'Payments are not configured yet. Add VITE_RAZORPAY_KEY_ID to your .env file and restart the dev server.',
        { duration: 6000 }
      );
      return;
    }

    setProcessing(true);
    try {
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        console.error('[Razorpay] checkout.js script failed to load (network/ad-blocker?)');
        toast.error('Unable to load payment gateway. Check your internet connection or disable ad-blockers for this site.');
        return;
      }

      if (!window.Razorpay) {
        console.error('[Razorpay] window.Razorpay is undefined even after script load resolved.');
        toast.error('Payment gateway failed to initialize. Please refresh and try again.');
        return;
      }

      const result = await dispatch(createOrder({ planType }));
      if (!createOrder.fulfilled.match(result)) {
        console.error('[Razorpay] create-order failed:', result.payload);
        toast.error(result.payload || 'Failed to create order');
        return;
      }

      const order = result.payload;
      // PaymentController.createOrder returns { orderId, amount, currency, receipt }
      // (deliberately renamed from the raw Payment document's razorpayOrderId).
      const razorpayOrderId = order?.orderId;
      if (!razorpayOrderId || !order?.amount) {
        console.error('[Razorpay] create-order response missing required fields:', order);
        toast.error('Order created but response was incomplete. Contact support.');
        return;
      }

      const options = {
        key: RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency || 'INR',
        name: 'Resume Builder',
        description: `${planLabel || planType} plan subscription`,
        order_id: razorpayOrderId,
        prefill: { name: user?.name, email: user?.email },
        theme: { color: '#2147e6' },
        handler: async (response) => {
          // response: { razorpay_order_id, razorpay_payment_id, razorpay_signature }
          const verifyResult = await dispatch(
            confirmPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            })
          );

          if (confirmPayment.fulfilled.match(verifyResult)) {
            toast.success('Payment verified! Your plan has been upgraded.');
            dispatch(fetchPaymentHistory());
            dispatch(getProfile());
            if (onSuccess) onSuccess();
            else navigate('/payment/history');
          } else {
            console.error('[Razorpay] Server-side verification failed:', verifyResult.payload);
            setFailure({
              description:
                verifyResult.payload ||
                'Payment was processed but could not be verified. Please contact support with your payment ID.',
              reason: 'verification_failed',
            });
            dispatch(fetchPaymentHistory());
          }
        },
        modal: {
          ondismiss: () => toast('Payment cancelled', { icon: 'ℹ️' }),
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.on('payment.failed', (response) => {
        console.error('[Razorpay] payment.failed event:', response.error);
        setFailure({
          description: response.error?.description,
          reason: response.error?.reason,
        });
        dispatch(fetchPaymentHistory());
      });
      razorpay.open();
    } catch (err) {
      console.error('[Razorpay] Unexpected error during checkout:', err);
      toast.error('Something went wrong while starting checkout');
    } finally {
      setProcessing(false);
    }
  };

  return { startCheckout, processing, failure, clearFailure };
};
