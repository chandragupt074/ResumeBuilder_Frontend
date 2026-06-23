import { useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { confirmEmail } from './authSlice';
import AuthLayout from '../../components/layout/AuthLayout';

const VerifyEmailPage = () => {
  const [searchParams] = useSearchParams();
  const dispatch = useDispatch();
  const { verification } = useSelector((state) => state.auth);
  const token = searchParams.get('token');

  useEffect(() => {
    if (token) {
      dispatch(confirmEmail(token));
    }
  }, [token, dispatch]);

  return (
    <AuthLayout title="Email verification" subtitle="Confirming your email address">
      <div className="flex flex-col items-center gap-4 py-6 text-center">
        {!token && (
          <p className="text-sm font-medium text-red-600">
            No verification token found in the link.
          </p>
        )}

        {token && verification.loading && (
          <>
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary-100 border-t-primary-600" />
            <p className="text-sm text-gray-600">Verifying your email...</p>
          </>
        )}

        {token && !verification.loading && verification.status === 'success' && (
          <>
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100 text-green-600">
              ✓
            </div>
            <p className="text-sm font-medium text-gray-900">
              {verification.message}
            </p>
            <Link to="/login" className="btn-primary mt-2">
              Go to login
            </Link>
          </>
        )}

        {token && !verification.loading && verification.status === 'error' && (
          <>
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-red-600">
              ✕
            </div>
            <p className="text-sm font-medium text-gray-900">
              {verification.message}
            </p>
            <Link to="/resend-verification" className="btn-primary mt-2">
              Resend verification email
            </Link>
          </>
        )}
      </div>
    </AuthLayout>
  );
};

export default VerifyEmailPage;
