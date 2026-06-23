import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { fetchTemplates } from '../features/templates/templateSlice';
import { fetchResumes, editResume } from '../features/resumes/resumeSlice';
import { TEMPLATE_META, COLOR_PALETTES, buildTemplateValue } from '../utils/templateMeta';
import Loader from '../components/common/Loader';
import Modal from '../components/common/Modal';

const TemplatesPage = () => {
  const dispatch = useDispatch();
  const {
    allTemplates,
    availableTemplates,
    subscriptionPlan,
    isPremium,
    loading,
    error,
  } = useSelector((state) => state.templates);
  const { resumes } = useSelector((state) => state.resumes);

  const [pickerCode, setPickerCode] = useState(null);
  const [applying, setApplying] = useState(false);

  useEffect(() => {
    dispatch(fetchTemplates());
    dispatch(fetchResumes());
  }, [dispatch]);

  if (loading) return <Loader label="Loading templates..." />;

  const isUnlocked = (code) => isPremium || availableTemplates.includes(code);

  const handleApply = async (resumeId) => {
    if (!pickerCode) return;
    setApplying(true);
    const templateValue = buildTemplateValue(pickerCode, COLOR_PALETTES[0].id);
    const result = await dispatch(editResume({ id: resumeId, data: { template: templateValue } }));
    setApplying(false);
    if (editResume.fulfilled.match(result)) {
      toast.success('Template applied to resume');
      setPickerCode(null);
    } else {
      toast.error(result.payload || 'Failed to apply template');
    }
  };

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-gray-900">Templates</h1>
          <p className="mt-1 text-sm text-gray-500">
            You're on the{' '}
            <span className="font-semibold capitalize text-gray-700">{subscriptionPlan}</span> plan.{' '}
            {!isPremium && (
              <>
                Unlock every template with{' '}
                <Link to="/pricing" className="font-semibold text-primary-600 hover:underline">
                  Premium
                </Link>
                .
              </>
            )}
          </p>
        </div>
        {!isPremium && (
          <Link to="/pricing" className="btn-primary">
            Upgrade to Premium
          </Link>
        )}
      </div>

      {error && (
        <div className="mb-4 rounded-lg bg-red-50 px-3.5 py-2.5 text-sm font-medium text-red-700">
          {typeof error === 'string' ? error : 'Failed to load templates'}
        </div>
      )}

      {allTemplates.length === 0 ? (
        <div className="card px-6 py-16 text-center text-sm text-gray-500">
          No templates available yet.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {allTemplates.map((code) => {
            const meta = TEMPLATE_META[code] || { name: `Template ${code}`, layout: 'single-column', description: '' };
            const unlocked = isUnlocked(code);

            return (
              <div key={code} className="card overflow-hidden">
                <div className="relative flex h-44 flex-col bg-gray-50 p-4">
                  {meta.layout === 'sidebar' ? (
                    <div className="flex h-full gap-1.5">
                      <div className="w-1/3 rounded-md bg-primary-100" />
                      <div className="flex-1 space-y-1.5 pt-1">
                        <div className="h-2 w-2/3 rounded bg-gray-300" />
                        <div className="h-1.5 w-full rounded bg-gray-200" />
                        <div className="h-1.5 w-5/6 rounded bg-gray-200" />
                      </div>
                    </div>
                  ) : (
                    <div className="h-full space-y-1.5">
                      <div className="flex items-center gap-2">
                        <div className="h-6 w-6 rounded-full bg-primary-100" />
                        <div className="h-2 w-1/2 rounded bg-gray-300" />
                      </div>
                      <div className="h-1.5 w-full rounded bg-gray-200" />
                      <div className="h-1.5 w-5/6 rounded bg-gray-200" />
                    </div>
                  )}

                  {!unlocked && (
                    <div className="absolute inset-0 flex items-center justify-center bg-white/70 backdrop-blur-sm">
                      <span className="rounded-full bg-gray-900/80 px-3 py-1 text-xs font-semibold text-white">
                        🔒 Premium
                      </span>
                    </div>
                  )}
                </div>

                <div className="p-4">
                  <p className="font-display text-sm font-bold text-gray-900">{meta.name}</p>
                  <p className="mt-1 text-xs text-gray-500">{meta.description}</p>

                  <button
                    onClick={() => {
                      if (!unlocked) {
                        toast.error('Upgrade to Premium to use this template');
                        return;
                      }
                      setPickerCode(code);
                    }}
                    className={`mt-4 w-full ${unlocked ? 'btn-primary' : 'btn-secondary'}`}
                  >
                    {unlocked ? 'Use this template' : 'Locked'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <Modal isOpen={!!pickerCode} onClose={() => setPickerCode(null)} title="Apply template to a resume">
        {resumes.length === 0 ? (
          <div className="text-center">
            <p className="text-sm text-gray-500">
              You don't have any resumes yet. Create one first from the dashboard.
            </p>
            <Link to="/dashboard" className="btn-primary mt-4 inline-flex">
              Go to dashboard
            </Link>
          </div>
        ) : (
          <div className="space-y-2">
            <p className="mb-2 text-sm text-gray-500">Choose which resume should use this template.</p>
            {resumes.map((resume) => (
              <button
                key={resume._id}
                onClick={() => handleApply(resume._id)}
                disabled={applying}
                className="flex w-full items-center justify-between rounded-lg border border-gray-200 px-4 py-3 text-left text-sm font-medium text-gray-900 transition-colors hover:border-primary-300 hover:bg-primary-50 disabled:opacity-60"
              >
                <span className="truncate">{resume.title}</span>
                <span className="text-xs text-gray-400">
                  {resume.template ? `Currently: ${resume.template}` : 'No template'}
                </span>
              </button>
            ))}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default TemplatesPage;
