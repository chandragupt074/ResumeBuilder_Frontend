import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { login, clearAuthError } from './authSlice';
import { validateEmail, validatePassword } from '../../utils/validation';
import AuthLayout from '../../components/layout/AuthLayout';

const LoginPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { loading, error } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({ email: '', password: '' });
  const [fieldErrors, setFieldErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (fieldErrors[name]) {
      setFieldErrors((prev) => ({ ...prev, [name]: '' }));
    }
    if (error) dispatch(clearAuthError());
  };

  const validate = () => {
    const errors = {
      email: validateEmail(formData.email),
      password: validatePassword(formData.password),
    };
    setFieldErrors(errors);
    return Object.values(errors).every((e) => !e);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    const result = await dispatch(login(formData));
    if (login.fulfilled.match(result)) {
      toast.success('Welcome back!');
      const redirectTo = location.state?.from?.pathname || '/dashboard';
      navigate(redirectTo, { replace: true });
    } else {
      toast.error(result.payload || 'Login failed');
    }
  };

  return (
    <AuthLayout title="Welcome back" subtitle="Sign in to continue building your resume">
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label htmlFor="email" className="label-field">
            Email address
          </label>
          <input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="you@example.com"
            className="input-field"
            autoComplete="email"
          />
          {fieldErrors.email && <p className="input-error">{fieldErrors.email}</p>}
        </div>

        <div>
          <label htmlFor="password" className="label-field">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Enter your password"
            className="input-field"
            autoComplete="current-password"
          />
          {fieldErrors.password && (
            <p className="input-error">{fieldErrors.password}</p>
          )}
        </div>

        {error && (
          <div className="rounded-lg bg-red-50 px-3.5 py-2.5 text-sm font-medium text-red-700">
            {typeof error === 'string' ? error : 'Login failed'}
          </div>
        )}

        <button type="submit" disabled={loading} className="btn-primary w-full">
          {loading ? 'Signing in...' : 'Sign in'}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-gray-600">
        Don&apos;t have an account?{' '}
        <Link to="/register" className="font-semibold text-primary-600 hover:text-primary-700">
          Create one
        </Link>
      </p>
    </AuthLayout>
  );
};

export default LoginPage;
