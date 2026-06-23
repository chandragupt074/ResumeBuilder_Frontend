import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';

// Redirects logged-in users away from public-only pages (landing, login, register)
const PublicRoute = () => {
  const { isAuthenticated } = useSelector((state) => state.auth);

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
};

export default PublicRoute;
