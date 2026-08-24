import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiGrid, FiUsers, FiUserPlus, FiCalendar, FiDollarSign, FiLogOut, FiActivity } from 'react-icons/fi';

const navItems = [
  { to: '/', icon: <FiGrid />, label: 'Dashboard' },
  { to: '/patients', icon: <FiUsers />, label: 'Patients' },
  { to: '/doctors', icon: <FiUserPlus />, label: 'Doctors' },
  { to: '/appointments', icon: <FiCalendar />, label: 'Appointments' },
  { to: '/billing', icon: <FiDollarSign />, label: 'Billing' },
];

export default function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <FiActivity className="brand-icon" />
        <span>HMS</span>
      </div>

      <nav className="sidebar-nav">
        {navItems.map((item) => (
          <NavLink key={item.to} to={item.to} end={item.to === '/'} className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            {item.icon}
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-footer">
        <div className="user-info">
          <div className="user-avatar">{user?.fullName?.charAt(0) || 'U'}</div>
          <div className="user-details">
            <span className="user-name">{user?.fullName || 'User'}</span>
            <span className="user-role">{user?.roles?.[0] || 'Staff'}</span>
          </div>
        </div>
        <button className="btn-logout" onClick={handleLogout}>
          <FiLogOut />
        </button>
      </div>
    </aside>
  );
}
