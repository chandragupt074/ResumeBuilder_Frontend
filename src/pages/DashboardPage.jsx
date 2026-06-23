import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { fetchResumes, addResume, removeResume } from '../features/resumes/resumeSlice';
import { validateTitle } from '../utils/validation';
import { getTemplateMeta, parseTemplateValue, getPalette } from '../utils/templateMeta';
import ResumePreview from '../features/resumeEditor/ResumePreview';
import Loader from '../components/common/Loader';
import Modal from '../components/common/Modal';

const DashboardPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { resumes, loading, saving } = useSelector((state) => state.resumes);
  const { user } = useSelector((state) => state.auth);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [titleError, setTitleError] = useState('');
  const [deleteTarget, setDeleteTarget] = useState(null);

  useEffect(() => {
    dispatch(fetchResumes());
  }, [dispatch]);

  const handleCreate = async (e) => {
    e.preventDefault();
    const err = validateTitle(title);
    if (err) {
      setTitleError(err);
      return;
    }
    const result = await dispatch(addResume({ title }));
    if (addResume.fulfilled.match(result)) {
      toast.success('Resume created');
      setIsModalOpen(false);
      setTitle('');
      setTitleError('');
      const newId = result.payload?._id || result.payload?.id;
      if (newId) navigate(`/resume/${newId}`);
    } else {
      toast.error(result.payload || 'Failed to create resume');
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    const result = await dispatch(removeResume(deleteTarget._id));
    if (removeResume.fulfilled.match(result)) {
      toast.success('Resume deleted');
    } else {
      toast.error(result.payload || 'Failed to delete resume');
    }
    setDeleteTarget(null);
  };

  return (
    <div>
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-gray-900">
            Welcome back{user?.name ? `, ${user.name}` : ''}
          </h1>
          <div className="mt-1 flex items-center gap-2 text-sm text-gray-500">
            <span>
              {resumes.length} resume{resumes.length === 1 ? '' : 's'} in your account
            </span>
            <span
              className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold ${
                (user?.subscriptionPlan || '').toLowerCase() === 'premium'
                  ? 'bg-primary-100 text-primary-700'
                  : 'bg-gray-100 text-gray-600'
              }`}
            >
              {user?.subscriptionPlan || 'Basic'}
            </span>
          </div>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="btn-primary">
          + New resume
        </button>
      </div>

      {loading ? (
        <Loader label="Loading your resumes..." />
      ) : resumes.length === 0 ? (
        <div className="card flex flex-col items-center gap-3 px-6 py-16 text-center">
          <p className="font-display text-lg font-semibold text-gray-900">
            No resumes yet
          </p>
          <p className="max-w-sm text-sm text-gray-500">
            Create your first resume to get started. You can choose a
            template, add your details, and download it as a PDF.
          </p>
          <button onClick={() => setIsModalOpen(true)} className="btn-primary mt-2">
            Create your first resume
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {resumes.map((resume) => (
            <div key={resume._id} className="card group overflow-hidden">
              <Link to={`/resume/${resume._id}`} className="block">
                <div className="relative h-44 overflow-hidden bg-gray-100">
                  {resume.thumbnailLink ? (
                    <img
                      src={resume.thumbnailLink}
                      alt={resume.title}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="absolute left-1/2 top-1/2 h-[280px] w-[400px] -translate-x-1/2 -translate-y-1/2 scale-[0.55]">
                      <ResumePreview data={resume} templateValue={resume.template} />
                    </div>
                  )}
                </div>
              </Link>
              <div className="flex items-center justify-between gap-2 p-4">
                <div className="min-w-0">
                  <Link
                    to={`/resume/${resume._id}`}
                    className="block truncate font-display text-sm font-bold text-gray-900 hover:text-primary-600"
                  >
                    {resume.title}
                  </Link>
                  <p className="mt-0.5 flex items-center gap-1.5 text-xs text-gray-400">
                    <span>
                      Updated {resume.updatedAt ? new Date(resume.updatedAt).toLocaleDateString() : '—'}
                    </span>
                    {resume.template && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-1.5 py-0.5 text-[10px] font-semibold text-gray-500">
                        <span
                          className="h-1.5 w-1.5 rounded-full"
                          style={{ backgroundColor: getPalette(parseTemplateValue(resume.template).colorId).accent }}
                        />
                        {getTemplateMeta(parseTemplateValue(resume.template).code).name}
                      </span>
                    )}
                  </p>
                </div>
                <button
                  onClick={() => setDeleteTarget(resume)}
                  className="rounded-lg p-2 text-gray-400 hover:bg-red-50 hover:text-red-600"
                  aria-label="Delete resume"
                >
                  🗑
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create resume modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Create a new resume">
        <form onSubmit={handleCreate} className="space-y-4">
          <div>
            <label htmlFor="title" className="label-field">
              Resume title
            </label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (titleError) setTitleError('');
              }}
              placeholder="e.g. Java Developer Resume"
              className="input-field"
              autoFocus
            />
            {titleError && <p className="input-error">{titleError}</p>}
          </div>
          <div className="flex justify-end gap-3">
            <button type="button" onClick={() => setIsModalOpen(false)} className="btn-secondary">
              Cancel
            </button>
            <button type="submit" disabled={saving} className="btn-primary">
              {saving ? 'Creating...' : 'Create'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete confirmation modal */}
      <Modal isOpen={!!deleteTarget} onClose={() => setDeleteTarget(null)} title="Delete resume">
        <p className="text-sm text-gray-600">
          Are you sure you want to delete{' '}
          <span className="font-semibold text-gray-900">{deleteTarget?.title}</span>?
          This action cannot be undone.
        </p>
        <div className="mt-5 flex justify-end gap-3">
          <button onClick={() => setDeleteTarget(null)} className="btn-secondary">
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

export default DashboardPage;
