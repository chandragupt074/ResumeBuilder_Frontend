import { useState } from 'react';
import toast from 'react-hot-toast';
import { TEMPLATE_META, COLOR_PALETTES, parseTemplateValue, buildTemplateValue } from '../../utils/templateMeta';
import { useRazorpayCheckout } from '../payment/useRazorpayCheckout';
import PaymentFailedModal from '../payment/PaymentFailedModal';

const ThemeModal = ({ isOpen, onClose, currentTemplate, availableTemplates, isPremium, subscriptionPlan, onApply }) => {
  const { startCheckout, processing, failure, clearFailure } = useRazorpayCheckout();
  const { code: initialCode, colorId: initialColorId } = parseTemplateValue(currentTemplate);
  const [tab, setTab] = useState('templates');
  const [selectedCode, setSelectedCode] = useState(initialCode);
  const [selectedColorId, setSelectedColorId] = useState(initialColorId);

  if (!isOpen) return null;

  const isUnlocked = (code) => isPremium || availableTemplates.includes(code);

  const handleDone = () => {
    onApply(buildTemplateValue(selectedCode, selectedColorId));
    onClose();
  };

  const handleUpgrade = () => {
    startCheckout({
      planType: 'premium',
      planLabel: 'Premium',
      onSuccess: () => {
        // Stay on the editor after a successful upgrade so the
        // newly unlocked templates can be selected right away.
      },
    });
  };

  const templateCodes = Object.keys(TEMPLATE_META);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="flex max-h-[85vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl bg-white shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
          <h2 className="font-display text-lg font-bold text-gray-900">Change Theme</h2>
          <button
            onClick={onClose}
            className="rounded-full p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        {/* Tabs + plan badge */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-100 px-6 py-3">
          <div className="flex items-center gap-1 rounded-lg bg-gray-100 p-1">
            <button
              onClick={() => setTab('templates')}
              className={`rounded-md px-3.5 py-1.5 text-sm font-semibold transition-colors ${
                tab === 'templates' ? 'bg-white text-primary-700 shadow-sm' : 'text-gray-500'
              }`}
            >
              Templates
            </button>
            <button
              onClick={() => setTab('colors')}
              className={`rounded-md px-3.5 py-1.5 text-sm font-semibold transition-colors ${
                tab === 'colors' ? 'bg-white text-primary-700 shadow-sm' : 'text-gray-500'
              }`}
            >
              Color Palettes
            </button>
          </div>

          <div className="flex items-center gap-2">
            <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-bold text-amber-700">
              {subscriptionPlan || 'Basic'} Plan
            </span>
            {!isPremium && (
              <button
                onClick={handleUpgrade}
                disabled={processing}
                className="rounded-full bg-primary-600 px-3.5 py-1.5 text-xs font-bold text-white hover:bg-primary-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {processing ? 'Opening checkout...' : 'Upgrade to Premium ₹999'}
              </button>
            )}
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-6">
          {tab === 'templates' ? (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {templateCodes.map((code) => {
                const meta = TEMPLATE_META[code];
                const unlocked = isUnlocked(code);
                const isSelected = selectedCode === code;

                return (
                  <button
                    key={code}
                    onClick={() => {
                      if (unlocked) {
                        setSelectedCode(code);
                      } else {
                        toast.error(
                          `"${meta.name}" is a Premium template. Upgrade to unlock it.`
                        );
                      }
                    }}
                    className={`group relative overflow-hidden rounded-xl border-2 text-left transition-all ${
                      isSelected ? 'border-primary-500 ring-2 ring-primary-100' : 'border-gray-200'
                    } ${unlocked ? 'cursor-pointer hover:border-primary-300' : 'cursor-pointer hover:border-amber-300'}`}
                  >
                    <div className="flex h-44 flex-col bg-gray-50 p-3">
                      {/* mini layout sketch */}
                      {meta.layout === 'sidebar' && (
                        <div className="flex h-full gap-1.5">
                          <div className="w-1/3 rounded-md bg-primary-100" />
                          <div className="flex-1 space-y-1.5">
                            <div className="h-2 w-2/3 rounded bg-gray-300" />
                            <div className="h-1.5 w-full rounded bg-gray-200" />
                            <div className="h-1.5 w-5/6 rounded bg-gray-200" />
                            <div className="h-1.5 w-full rounded bg-gray-200" />
                          </div>
                        </div>
                      )}
                      {meta.layout === 'single-column' && (
                        <div className="h-full space-y-1.5">
                          <div className="flex items-center gap-2 rounded bg-primary-100 p-1.5">
                            <div className="h-6 w-6 rounded-full bg-white/70" />
                            <div className="h-2 w-1/2 rounded bg-white/70" />
                          </div>
                          <div className="h-1.5 w-full rounded bg-gray-200" />
                          <div className="h-1.5 w-5/6 rounded bg-gray-200" />
                          <div className="h-1.5 w-full rounded bg-gray-200" />
                          <div className="h-1.5 w-2/3 rounded bg-gray-200" />
                        </div>
                      )}
                      {meta.layout === 'compact' && (
                        <div className="h-full space-y-1.5">
                          <div className="h-1.5 w-2/3 rounded bg-primary-200" />
                          <div className="flex gap-1.5">
                            <div className="w-2/3 space-y-1">
                              <div className="h-1.5 w-full rounded bg-gray-200" />
                              <div className="h-1.5 w-full rounded bg-gray-200" />
                              <div className="h-1.5 w-5/6 rounded bg-gray-200" />
                            </div>
                            <div className="flex-1 space-y-1">
                              <div className="h-1.5 w-full rounded bg-gray-200" />
                              <div className="h-1.5 w-full rounded bg-gray-200" />
                              <div className="h-1.5 w-2/3 rounded bg-gray-200" />
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="border-t border-gray-100 p-3">
                      <p className="text-sm font-bold text-gray-900">{meta.name}</p>
                      <p className="mt-0.5 text-xs text-gray-400">{meta.description}</p>
                    </div>

                    {!unlocked && (
                      <div className="absolute inset-0 flex items-center justify-center bg-white/70 backdrop-blur-sm">
                        <span className="rounded-full bg-gray-900/80 px-3 py-1 text-xs font-semibold text-white">
                          🔒 Premium
                        </span>
                      </div>
                    )}
                    {isSelected && unlocked && (
                      <span className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-primary-600 text-xs text-white">
                        ✓
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
              {COLOR_PALETTES.map((palette) => {
                const isSelected = selectedColorId === palette.id;
                return (
                  <button
                    key={palette.id}
                    onClick={() => setSelectedColorId(palette.id)}
                    className={`flex flex-col items-center gap-3 rounded-xl border-2 p-4 transition-all ${
                      isSelected ? 'border-primary-500 ring-2 ring-primary-100' : 'border-gray-200 hover:border-primary-200'
                    }`}
                  >
                    <div className="flex gap-1.5">
                      <span className="h-8 w-8 rounded-full" style={{ backgroundColor: palette.accent }} />
                      <span className="h-8 w-8 rounded-full" style={{ backgroundColor: palette.soft }} />
                    </div>
                    <span className="text-sm font-semibold text-gray-800">{palette.label}</span>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 border-t border-gray-100 px-6 py-4">
          <button onClick={onClose} className="btn-secondary">
            Cancel
          </button>
          <button onClick={handleDone} className="btn-primary">
            Done
          </button>
        </div>
      </div>

      <PaymentFailedModal
        isOpen={!!failure}
        onClose={clearFailure}
        onRetry={() => {
          clearFailure();
          handleUpgrade();
        }}
        errorDetails={failure}
      />
    </div>
  );
};

export default ThemeModal;
