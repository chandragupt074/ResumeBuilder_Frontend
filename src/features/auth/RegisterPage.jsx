import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { register, clearAuthError } from './authSlice';
import { validateEmail, validateName, validatePassword } from '../../utils/validation';
import AuthLayout from '../../components/layout/AuthLayout';

const RegisterPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });
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
      name: validateName(formData.name),
      email: validateEmail(formData.email),
      password: validatePassword(formData.password),
    };
    setFieldErrors(errors);
    return Object.values(errors).every((e) => !e);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    const result = await dispatch(register(formData));
    if (register.fulfilled.match(result)) {
      toast.success('Registration successful! Please verify your email.');
      navigate('/login');
    } else {
      toast.error(result.payload || 'Registration failed');
    }
  };

  return (
    <AuthLayout
      title="Create your account"
      subtitle="Build a standout resume in minutes"
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label htmlFor="name" className="label-field">
            Full name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            value={formData.name}
            onChange={handleChange}
            placeholder="Saini Kumar"
            className="input-field"
            autoComplete="name"
          />
          {fieldErrors.name && <p className="input-error">{fieldErrors.name}</p>}
        </div>

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
            placeholder="At least 6 characters"
            className="input-field"
            autoComplete="new-password"
          />
          {fieldErrors.password && (
            <p className="input-error">{fieldErrors.password}</p>
          )}
        </div>

        {error && (
          <div className="rounded-lg bg-red-50 px-3.5 py-2.5 text-sm font-medium text-red-700">
            {typeof error === 'string' ? error : 'Registration failed'}
          </div>
        )}

        <button type="submit" disabled={loading} className="btn-primary w-full">
          {loading ? 'Creating account...' : 'Create account'}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-gray-600">
        Already have an account?{' '}
        <Link to="/login" className="font-semibold text-primary-600 hover:text-primary-700">
          Sign in
        </Link>
      </p>
    </AuthLayout>
  );
};

export default RegisterPage;
