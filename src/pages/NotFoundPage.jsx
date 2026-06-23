import { Link } from 'react-router-dom';

const NotFoundPage = () => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-3 bg-gray-50 px-4 text-center">
      <p className="font-display text-6xl font-bold text-primary-600">404</p>
      <h1 className="font-display text-xl font-bold text-gray-900">Page not found</h1>
      <p className="text-sm text-gray-500">The page you're looking for doesn't exist.</p>
      <Link to="/dashboard" className="btn-primary mt-4">
        Go to dashboard
      </Link>
    </div>
  );
};

export default NotFoundPage;
