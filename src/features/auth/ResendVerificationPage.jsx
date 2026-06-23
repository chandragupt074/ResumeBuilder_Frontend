import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { resendVerificationEmail } from './authSlice';
import { validateEmail } from '../../utils/validation';
import AuthLayout from '../../components/layout/AuthLayout';

const ResendVerificationPage = () => {
  const dispatch = useDispatch();
  const { resend } = useSelector((state) => state.auth);
  const [email, setEmail] = useState('');
  const [fieldError, setFieldError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const err = validateEmail(email);
    if (err) {
      setFieldError(err);
      return;
    }
    setFieldError('');
    dispatch(resendVerificationEmail(email));
  };

  return (
    <AuthLayout
      title="Resend verification email"
      subtitle="Enter your email to receive a new verification link"
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label htmlFor="email" className="label-field">
            Email address
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="input-field"
            autoComplete="email"
          />
          {fieldError && <p className="input-error">{fieldError}</p>}
        </div>

        {resend.message && (
          <div className="rounded-lg bg-primary-50 px-3.5 py-2.5 text-sm font-medium text-primary-700">
            {resend.message}
          </div>
        )}

        <button type="submit" disabled={resend.loading} className="btn-primary w-full">
          {resend.loading ? 'Sending...' : 'Send verification email'}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-gray-600">
        <Link to="/login" className="font-semibold text-primary-600 hover:text-primary-700">
          Back to login
        </Link>
      </p>
    </AuthLayout>
  );
};

export default ResendVerificationPage;
