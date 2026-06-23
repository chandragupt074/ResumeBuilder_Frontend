import { Link, useNavigate, NavLink } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../features/auth/authSlice';

const navLinkClass = ({ isActive }) =>
  `transition-colors hover:text-primary-600 ${isActive ? 'text-primary-600' : 'text-gray-600'}`;

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const initials = user?.name
    ? user.name
        .split(' ')
        .map((part) => part[0])
        .slice(0, 2)
        .join('')
        .toUpperCase()
    : 'U';

  const isPremium = (user?.subscriptionPlan || '').toLowerCase() === 'premium';

  return (
    <header className="sticky top-0 z-30 border-b border-gray-200 bg-white/80 backdrop-blur-sm">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link to="/dashboard" className="font-display text-xl font-bold text-primary-700">
          ResumeForge
        </Link>

        <nav className="hidden items-center gap-6 text-sm font-medium md:flex">
          <NavLink to="/dashboard" className={navLinkClass}>
            My resumes
          </NavLink>
          <NavLink to="/templates" className={navLinkClass}>
            Templates
          </NavLink>
          <NavLink to="/pricing" className={navLinkClass}>
            Pricing
          </NavLink>
          <NavLink to="/payment/history" className={navLinkClass}>
            Billing
          </NavLink>
          <NavLink to="/profile" className={navLinkClass}>
            Profile
          </NavLink>
        </nav>

        <div className="flex items-center gap-3">
          {!isPremium && (
            <Link to="/pricing" className="hidden rounded-full bg-primary-50 px-3 py-1 text-xs font-semibold text-primary-700 hover:bg-primary-100 sm:inline-flex">
              Upgrade
            </Link>
          )}
          <Link
            to="/profile"
            className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-full bg-primary-100 text-sm font-semibold text-primary-700"
            title={user?.name}
          >
            {user?.profileImageUrl ? (
              <img
                src={user.profileImageUrl}
                alt={user?.name}
                className="h-full w-full object-cover"
              />
            ) : (
              initials
            )}
          </Link>
          <button onClick={handleLogout} className="btn-secondary !py-2 text-xs">
            Logout
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
