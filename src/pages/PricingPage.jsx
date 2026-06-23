import { useSelector } from 'react-redux';
import { useRazorpayCheckout } from '../features/payment/useRazorpayCheckout';
import PaymentFailedModal from '../features/payment/PaymentFailedModal';

const plans = [
  {
    id: 'basic',
    name: 'Basic',
    price: 0,
    description: 'Get started with the essentials.',
    features: ['1 active resume', '1 starter template', 'PDF export', 'Email delivery'],
    cta: 'Current plan',
  },
  {
    id: 'premium',
    name: 'Premium',
    price: 999,
    description: 'Unlock every template and feature.',
    features: [
      'Unlimited resumes',
      'All premium templates',
      'Priority email delivery',
      'Early access to new templates',
    ],
    cta: 'Upgrade to Premium',
    highlighted: true,
  },
];

const PricingPage = () => {
  const { user } = useSelector((state) => state.auth);
  const { startCheckout, processing, failure, clearFailure } = useRazorpayCheckout();

  const currentPlan = (user?.subscriptionPlan || 'basic').toLowerCase();
  const lastAttemptedPlan = currentPlan === 'premium' ? null : plans.find((p) => p.id === 'premium');

  const handleUpgrade = (plan) => {
    if (plan.id === 'basic' || plan.id === currentPlan) return;
    startCheckout({ planType: plan.id, planLabel: plan.name });
  };

  const handleRetry = () => {
    clearFailure();
    if (lastAttemptedPlan) handleUpgrade(lastAttemptedPlan);
  };

  return (
    <div>
      <div className="mx-auto max-w-2xl text-center">
        <h1 className="font-display text-2xl font-bold text-gray-900 sm:text-3xl">
          Simple, transparent pricing
        </h1>
        <p className="mt-2 text-sm text-gray-500">
          Start for free. Upgrade to Premium to unlock every template and
          feature, no hidden fees.
        </p>
      </div>

      <div className="mx-auto mt-10 grid max-w-4xl grid-cols-1 gap-6 sm:grid-cols-2">
        {plans.map((plan) => {
          const isCurrent = currentPlan === plan.id;
          return (
            <div
              key={plan.id}
              className={`card relative flex flex-col p-6 ${
                plan.highlighted ? 'border-primary-500 ring-1 ring-primary-100' : ''
              }`}
            >
              {plan.highlighted && (
                <span className="absolute -top-3 right-6 rounded-full bg-primary-600 px-3 py-1 text-xs font-semibold text-white">
                  Most popular
                </span>
              )}
              <h3 className="font-display text-lg font-bold text-gray-900">{plan.name}</h3>
              <p className="mt-1 text-sm text-gray-500">{plan.description}</p>

              <div className="mt-5 flex items-baseline gap-1">
                <span className="font-display text-3xl font-bold text-gray-900">
                  {plan.price === 0 ? '₹0' : `₹${plan.price.toLocaleString('en-IN')}`}
                </span>
                {plan.price > 0 && (
                  <span className="text-sm font-medium text-gray-400">/ one-time</span>
                )}
              </div>

              <ul className="mt-6 space-y-2.5 text-sm text-gray-600">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2">
                    <span className="text-primary-600">✓</span>
                    {feature}
                  </li>
                ))}
              </ul>

              <button
                onClick={() => handleUpgrade(plan)}
                disabled={isCurrent || plan.id === 'basic' || processing}
                className={`mt-8 ${plan.highlighted ? 'btn-primary' : 'btn-secondary'} w-full`}
              >
                {isCurrent ? 'Current plan' : processing ? 'Processing...' : plan.cta}
              </button>
            </div>
          );
        })}
      </div>

      <p className="mx-auto mt-6 max-w-2xl text-center text-xs text-gray-400">
        Payments are securely processed by Razorpay. Your card details are
        never stored on our servers.
      </p>

      <PaymentFailedModal
        isOpen={!!failure}
        onClose={clearFailure}
        onRetry={handleRetry}
        errorDetails={failure}
      />
    </div>
  );
};

export default PricingPage;
