import { useEffect, useMemo, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import {
  fetchResumeById,
  editResume,
  removeResume,
  clearCurrentResume,
  uploadResumeImagesThunk,
} from '../features/resumes/resumeSlice';
import { fetchTemplates } from '../features/templates/templateSlice';
import { logout } from '../features/auth/authSlice';
import { STEPS } from '../features/resumeEditor/steps';
import ResumePreview from '../features/resumeEditor/ResumePreview';
import ThemeModal from '../features/resumeEditor/ThemeModal';
import PreviewDownloadModal from '../features/resumeEditor/PreviewDownloadModal';
import PersonalInfoStep from '../features/resumeEditor/steps/PersonalInfoStep';
import ContactStep from '../features/resumeEditor/steps/ContactStep';
import WorkExperienceStep from '../features/resumeEditor/steps/WorkExperienceStep';
import EducationStep from '../features/resumeEditor/steps/EducationStep';
import SkillsStep from '../features/resumeEditor/steps/SkillsStep';
import ProjectsStep from '../features/resumeEditor/steps/ProjectsStep';
import CertificationsStep from '../features/resumeEditor/steps/CertificationsStep';
import LanguagesStep from '../features/resumeEditor/steps/LanguagesStep';
import InterestsStep from '../features/resumeEditor/steps/InterestsStep';
import Loader from '../components/common/Loader';
import Modal from '../components/common/Modal';

const emptyResume = {
  title: '',
  template: '01-violet',
  profileInfo: { profilePreviewUrl: '', fullname: '', designation: '', summary: '' },
  contactInfo: { email: '', phone: '', location: '', linkedIn: '', github: '', website: '' },
  workExperience: [],
  education: [],
  skills: [],
  projects: [],
  certifications: [],
  languages: [],
  interests: [],
};

const ResumeEditorPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentResume, loading, saving } = useSelector((state) => state.resumes);
  const { availableTemplates, subscriptionPlan, isPremium } = useSelector((state) => state.templates);
  const { user } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState(emptyResume);
  const [stepIndex, setStepIndex] = useState(0);
  const [isThemeModalOpen, setIsThemeModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [isTitleEditing, setIsTitleEditing] = useState(false);

  useEffect(() => {
    dispatch(fetchResumeById(id));
    dispatch(fetchTemplates());
    return () => dispatch(clearCurrentResume());
  }, [id, dispatch]);

  useEffect(() => {
    if (currentResume) {
      setFormData({
        title: currentResume.title || '',
        template: currentResume.template || '01-violet',
        profileInfo: currentResume.profileInfo || emptyResume.profileInfo,
        contactInfo: currentResume.contactInfo || emptyResume.contactInfo,
        workExperience: currentResume.workExperience || [],
        education: currentResume.education || [],
        skills: currentResume.skills || [],
        projects: currentResume.projects || [],
        certifications: currentResume.certifications || [],
        languages: currentResume.languages || [],
        interests: currentResume.interests || [],
      });
    }
  }, [currentResume]);

  // ---------- Generic helpers ----------
  const updateNestedField = (section, field, value) => {
    setFormData((prev) => ({ ...prev, [section]: { ...prev[section], [field]: value } }));
  };

  const updateListItem = (section, index, field, value) => {
    setFormData((prev) => {
      const list = [...prev[section]];
      list[index] = { ...list[index], [field]: value };
      return { ...prev, [section]: list };
    });
  };

  const addListItem = (section, item) => {
    setFormData((prev) => ({ ...prev, [section]: [...prev[section], item] }));
  };

  const removeListItem = (section, index) => {
    setFormData((prev) => ({ ...prev, [section]: prev[section].filter((_, i) => i !== index) }));
  };

  const updateInterestValue = (index, value) => {
    setFormData((prev) => {
      const list = [...prev.interests];
      list[index] = value;
      return { ...prev, interests: list };
    });
  };

  // ---------- Persistence ----------
  const persist = async (data, { silent = false } = {}) => {
    const result = await dispatch(editResume({ id, data }));
    if (editResume.fulfilled.match(result)) {
      if (!silent) toast.success('Saved');
      return true;
    }
    toast.error(result.payload || 'Failed to save resume');
    return false;
  };

  const handleSaveAndExit = async () => {
    const ok = await persist(formData);
    if (ok) navigate('/dashboard');
  };

  const handleNext = async () => {
    await persist(formData, { silent: true });
    setStepIndex((i) => Math.min(i + 1, STEPS.length - 1));
  };

  const handleBack = () => {
    setStepIndex((i) => Math.max(i - 1, 0));
  };

  const handleApplyTheme = async (templateValue) => {
    setFormData((prev) => ({ ...prev, template: templateValue }));
    await persist({ ...formData, template: templateValue }, { silent: true });
    toast.success('Theme updated');
  };

  const handleImageSelect = async (file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      updateNestedField('profileInfo', 'profilePreviewUrl', reader.result);
    };
    reader.readAsDataURL(file);

    const fd = new FormData();
    fd.append('profileImage', file);
    const result = await dispatch(uploadResumeImagesThunk({ id, formData: fd }));
    if (uploadResumeImagesThunk.fulfilled.match(result)) {
      toast.success('Image uploaded');
    } else {
      toast.error(result.payload || 'Failed to upload image');
    }
  };

  const handleDelete = async () => {
    const result = await dispatch(removeResume(id));
    if (removeResume.fulfilled.match(result)) {
      toast.success('Resume deleted');
      navigate('/dashboard');
    } else {
      toast.error(result.payload || 'Failed to delete resume');
    }
  };

  const handleTitleSave = async () => {
    setIsTitleEditing(false);
    await persist(formData, { silent: true });
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const currentStep = STEPS[stepIndex];

  const stepContent = useMemo(() => {
    switch (currentStep.id) {
      case 'personal':
        return (
          <PersonalInfoStep
            data={formData.profileInfo}
            onChange={(field, value) => updateNestedField('profileInfo', field, value)}
            onImageSelect={handleImageSelect}
          />
        );
      case 'contact':
        return (
          <ContactStep
            data={formData.contactInfo}
            onChange={(field, value) => updateNestedField('contactInfo', field, value)}
          />
        );
      case 'experience':
        return (
          <WorkExperienceStep
            items={formData.workExperience}
            onAdd={(item) => addListItem('workExperience', item)}
            onUpdate={(i, field, value) => updateListItem('workExperience', i, field, value)}
            onRemove={(i) => removeListItem('workExperience', i)}
          />
        );
      case 'education':
        return (
          <EducationStep
            items={formData.education}
            onAdd={(item) => addListItem('education', item)}
            onUpdate={(i, field, value) => updateListItem('education', i, field, value)}
            onRemove={(i) => removeListItem('education', i)}
          />
        );
      case 'skills':
        return (
          <SkillsStep
            items={formData.skills}
            onAdd={(item) => addListItem('skills', item)}
            onUpdate={(i, field, value) => updateListItem('skills', i, field, value)}
            onRemove={(i) => removeListItem('skills', i)}
          />
        );
      case 'projects':
        return (
          <ProjectsStep
            items={formData.projects}
            onAdd={(item) => addListItem('projects', item)}
            onUpdate={(i, field, value) => updateListItem('projects', i, field, value)}
            onRemove={(i) => removeListItem('projects', i)}
          />
        );
      case 'certifications':
        return (
          <CertificationsStep
            items={formData.certifications}
            onAdd={(item) => addListItem('certifications', item)}
            onUpdate={(i, field, value) => updateListItem('certifications', i, field, value)}
            onRemove={(i) => removeListItem('certifications', i)}
          />
        );
      case 'languages':
        return (
          <LanguagesStep
            items={formData.languages}
            onAdd={(item) => addListItem('languages', item)}
            onUpdate={(i, field, value) => updateListItem('languages', i, field, value)}
            onRemove={(i) => removeListItem('languages', i)}
          />
        );
      case 'interests':
        return (
          <InterestsStep
            items={formData.interests}
            onAdd={(item) => addListItem('interests', item)}
            onUpdateValue={updateInterestValue}
            onRemove={(i) => removeListItem('interests', i)}
          />
        );
      default:
        return null;
    }
  }, [currentStep.id, formData]);

  if (loading || !currentResume) {
    return <Loader label="Loading resume..." />;
  }

  const isLastStep = stepIndex === STEPS.length - 1;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top bar */}
      <div className="border-b border-gray-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-8">
          <Link to="/dashboard" className="flex items-center gap-2 font-display text-lg font-bold text-primary-700">
            📄 Resume Builder
          </Link>

          <div className="flex items-center gap-3">
            {user?.profileImageUrl ? (
              <img src={user.profileImageUrl} alt={user.name} className="h-8 w-8 rounded-full object-cover" />
            ) : (
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-100 text-xs font-bold text-primary-700">
                {user?.name?.[0]?.toUpperCase() || 'U'}
              </div>
            )}
            <div className="text-right">
              <div className="flex items-center justify-end gap-1.5">
                <p className="text-sm font-semibold text-gray-900">{user?.name}</p>
                <span
                  className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                    isPremium ? 'bg-primary-100 text-primary-700' : 'bg-amber-100 text-amber-700'
                  }`}
                >
                  {subscriptionPlan || 'Basic'}
                </span>
              </div>
              <button onClick={handleLogout} className="text-xs font-medium text-primary-600 hover:underline">
                Logout
              </button>
            </div>
          </div>
        </div>

        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 border-t border-gray-100 px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2">
            {isTitleEditing ? (
              <input
                autoFocus
                className="border-b-2 border-primary-300 bg-transparent font-display text-lg font-bold text-gray-900 focus:outline-none"
                value={formData.title}
                onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                onBlur={handleTitleSave}
                onKeyDown={(e) => e.key === 'Enter' && handleTitleSave()}
              />
            ) : (
              <button
                onClick={() => setIsTitleEditing(true)}
                className="flex items-center gap-2 font-display text-lg font-bold text-gray-900 hover:text-primary-600"
              >
                {formData.title || 'Untitled resume'}
                <span className="text-sm text-gray-400">✎</span>
              </button>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button onClick={() => setIsThemeModalOpen(true)} className="btn-secondary !py-2 text-sm">
              🎨 Change Theme
            </button>
            <button onClick={() => setIsDeleteModalOpen(true)} className="btn-secondary !py-2 text-sm text-red-600">
              🗑 Delete
            </button>
            <button onClick={() => setIsPreviewModalOpen(true)} className="btn-primary !py-2 text-sm">
              ⬇ Preview &amp; Download
            </button>
          </div>
        </div>
      </div>

      {/* Step progress */}
      <div className="border-b border-gray-200 bg-white">
        <div className="mx-auto flex max-w-7xl gap-1 overflow-x-auto px-4 py-3 sm:px-6 lg:px-8">
          {STEPS.map((step, i) => (
            <button
              key={step.id}
              onClick={() => setStepIndex(i)}
              className={`whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-semibold transition-colors ${
                i === stepIndex
                  ? 'bg-primary-600 text-white'
                  : i < stepIndex
                  ? 'bg-primary-50 text-primary-700'
                  : 'bg-gray-100 text-gray-400'
              }`}
            >
              {i + 1}. {step.label}
            </button>
          ))}
        </div>
      </div>

      {/* Body: form + live preview */}
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 px-4 py-8 sm:px-6 lg:grid-cols-2 lg:px-8">
        {/* Form panel */}
        <div className="card p-6">
          {stepContent}

          <div className="mt-8 flex items-center justify-between border-t border-gray-100 pt-6">
            <button onClick={handleBack} disabled={stepIndex === 0} className="btn-secondary">
              ← Back
            </button>
            <button onClick={handleSaveAndExit} disabled={saving} className="btn-secondary">
              💾 Save & Exit
            </button>
            {isLastStep ? (
              <button onClick={handleSaveAndExit} disabled={saving} className="btn-primary">
                {saving ? 'Saving...' : 'Finish'}
              </button>
            ) : (
              <button onClick={handleNext} disabled={saving} className="btn-primary">
                Next →
              </button>
            )}
          </div>
        </div>

        {/* Live preview panel */}
        <div className="hidden lg:block">
          <div className="sticky top-6 h-[calc(100vh-160px)]">
            <ResumePreview data={formData} templateValue={formData.template} />
          </div>
        </div>
      </div>

      {/* Mobile preview toggle */}
      <div className="px-4 pb-8 lg:hidden">
        <details className="card overflow-hidden">
          <summary className="cursor-pointer px-4 py-3 text-sm font-semibold text-gray-700">
            Show live preview
          </summary>
          <div className="h-[480px] p-4">
            <ResumePreview data={formData} templateValue={formData.template} />
          </div>
        </details>
      </div>

      <ThemeModal
        isOpen={isThemeModalOpen}
        onClose={() => setIsThemeModalOpen(false)}
        currentTemplate={formData.template}
        availableTemplates={availableTemplates}
        isPremium={isPremium}
        subscriptionPlan={subscriptionPlan}
        onApply={handleApplyTheme}
      />

      <PreviewDownloadModal
        isOpen={isPreviewModalOpen}
        onClose={() => setIsPreviewModalOpen(false)}
        data={formData}
        templateValue={formData.template}
        title={formData.title}
      />

      <Modal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} title="Delete resume">
        <p className="text-sm text-gray-600">
          Are you sure you want to delete <span className="font-semibold text-gray-900">{formData.title}</span>?
          This action cannot be undone.
        </p>
        <div className="mt-5 flex justify-end gap-3">
          <button onClick={() => setIsDeleteModalOpen(false)} className="btn-secondary">
            Cancel
          </button>
          <button onClick={handleDelete} className="btn-danger">
            Delete
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default ResumeEditorPage;
