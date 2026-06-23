import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { getProfile } from '../features/auth/authSlice';
import { uploadProfileImage } from '../features/auth/authAPI';
import Loader from '../components/common/Loader';

const ProfilePage = () => {
  const dispatch = useDispatch();
  const { user, loading } = useSelector((state) => state.auth);
  const [imageFile, setImageFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    dispatch(getProfile());
  }, [dispatch]);

  const handleUpload = async () => {
    if (!imageFile) return;
    setUploading(true);
    try {
      await uploadProfileImage(imageFile);
      toast.success('Profile image updated');
      dispatch(getProfile());
      setImageFile(null);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  if (loading && !user) return <Loader label="Loading profile..." />;

  // API returns either `emailVerification` (profile/login response) or
  // `emailVerified` (raw user document) depending on endpoint.
  const isEmailVerified = user?.emailVerification ?? user?.emailVerified ?? false;
  const plan = user?.subscriptionPlan || 'Basic';
  const isPremium = plan.toLowerCase() === 'premium';

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="mb-6 font-display text-2xl font-bold text-gray-900">Profile</h1>

      <div className="card p-6">
        <div className="flex items-center gap-4">
          <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-full bg-primary-100 text-2xl font-bold text-primary-700">
            {user?.profileImageUrl ? (
              <img src={user.profileImageUrl} alt={user.name} className="h-full w-full object-cover" />
            ) : (
              user?.name?.[0]?.toUpperCase() || 'U'
            )}
          </div>
          <div>
            <p className="font-display text-lg font-bold text-gray-900">{user?.name}</p>
            <p className="text-sm text-gray-500">{user?.email}</p>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
              Subscription plan
            </p>
            <div className="mt-1 flex items-center gap-2">
              <span
                className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                  isPremium ? 'bg-primary-100 text-primary-700' : 'bg-gray-100 text-gray-700'
                }`}
              >
                {plan}
              </span>
              {!isPremium && (
                <Link to="/pricing" className="text-xs font-semibold text-primary-600 hover:underline">
                  Upgrade
                </Link>
              )}
            </div>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
              Email verified
            </p>
            <p className="mt-1 text-sm font-medium text-gray-900">
              {isEmailVerified ? (
                <span className="text-green-600">Verified</span>
              ) : (
                <span className="text-amber-600">Not verified</span>
              )}
            </p>
          </div>
        </div>

        <div className="mt-6 border-t border-gray-100 pt-6">
          <label className="label-field">Update profile picture</label>
          <div className="flex items-center gap-3">
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImageFile(e.target.files?.[0] || null)}
              className="text-sm"
            />
            <button onClick={handleUpload} disabled={uploading || !imageFile} className="btn-secondary !py-2 text-xs">
              {uploading ? 'Uploading...' : 'Upload'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
