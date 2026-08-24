import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  FiGrid, FiUsers, FiUserCheck, FiCalendar,
  FiCreditCard, FiLogOut, FiActivity
} from 'react-icons/fi';
import { RiHospitalLine } from 'react-icons/ri';

const navItems = [
  { to: '/',             icon: <FiGrid />,       label: 'Dashboard' },
  { to: '/patients',     icon: <FiUsers />,      label: 'Patients' },
  { to: '/doctors',      icon: <FiUserCheck />,  label: 'Doctors' },
  { to: '/appointments', icon: <FiCalendar />,   label: 'Appointments' },
  { to: '/billing',      icon: <FiCreditCard />, label: 'Billing' },
];

export default function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const initials = user?.fullName
    ? user.fullName.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase()
    : 'U';

  return (
    <aside className="sidebar">
      {/* Brand */}
      <div className="sidebar-brand">
        <div className="brand-logo">
          <RiHospitalLine />
        </div>
        <div className="brand-text">
          <span className="brand-name">MediCore HMS</span>
          <span className="brand-tagline">Hospital Management</span>
        </div>
      </div>

      {/* Navigation */}
      <p className="sidebar-section-title">Main Menu</p>
      <nav className="sidebar-nav">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/'}
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
          >
            <span className="nav-icon">{item.icon}</span>
            <span className="nav-label">{item.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* User Footer */}
      <div className="sidebar-footer">
        <div className="user-card">
          <div className="user-avatar">{initials}</div>
          <div className="user-info">
            <div className="user-name">{user?.fullName || 'User'}</div>
            <div className="user-role">{user?.roles?.[0] || 'Staff'}</div>
          </div>
          <button className="btn-logout" onClick={handleLogout} title="Logout">
            <FiLogOut />
          </button>
        </div>
      </div>
    </aside>
  );
}
