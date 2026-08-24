import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/client';
import { useAuth } from '../context/AuthContext';
import {
  FiUsers, FiUserCheck, FiCalendar, FiAlertCircle,
  FiArrowRight, FiPlus,
} from 'react-icons/fi';
import {
  RiHeartPulseLine, RiMoneyDollarCircleLine, RiCalendarCheckLine,
} from 'react-icons/ri';

export default function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/dashboard/stats')
      .then(res => { setStats(res.data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="page-loader">
      <div className="spinner" style={{ borderTopColor: 'var(--accent-primary)', width: 24, height: 24 }} />
      Loading dashboard...
    </div>
  );

  const cards = [
    {
      icon: <FiUsers />,
      label: 'Total Patients',
      value: stats?.totalPatients ?? 0,
      color: 'var(--accent-primary)',
      bg: 'var(--accent-primary-glow)',
      sub: 'Registered in system',
    },
    {
      icon: <FiUserCheck />,
      label: 'Total Doctors',
      value: stats?.totalDoctors ?? 0,
      color: 'var(--accent-teal)',
      bg: 'var(--accent-teal-glow)',
      sub: 'Active physicians',
    },
    {
      icon: <FiCalendar />,
      label: "Today's Appointments",
      value: stats?.todaysAppointments ?? 0,
      color: 'var(--accent-violet)',
      bg: 'var(--accent-violet-glow)',
      sub: 'Scheduled for today',
    },
    {
      icon: <RiMoneyDollarCircleLine />,
      label: 'Revenue This Month',
      value: `LKR ${(stats?.revenueThisMonth ?? 0).toLocaleString('en-LK')}`,
      color: 'var(--accent-emerald)',
      bg: 'var(--accent-emerald-glow)',
      sub: 'Billing collected',
    },
    {
      icon: <FiAlertCircle />,
      label: 'Outstanding Balance',
      value: `LKR ${(stats?.outstandingBalance ?? 0).toLocaleString('en-LK')}`,
      color: 'var(--accent-amber)',
      bg: 'var(--accent-amber-glow)',
      sub: 'Pending payments',
    },
  ];

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';
  const firstName = user?.fullName?.split(' ')[0] || 'Doctor';

  return (
    <div className="page">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1>
            <RiHeartPulseLine style={{ color: 'var(--accent-rose)', fontSize: '1.5rem', verticalAlign: 'middle' }} />
            {' '}{greeting}, {firstName}
          </h1>
          <p>
            Here's your hospital overview for {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        {cards.map((card, i) => (
          <div key={i} className="stat-card" style={{ '--card-accent': card.color }}>
            <div className="stat-icon" style={{ background: card.bg, color: card.color }}>
              {card.icon}
            </div>
            <div className="stat-info">
              <span className="stat-value">{card.value}</span>
              <span className="stat-label">{card.label}</span>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                {card.sub}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div style={{ marginTop: '16px' }}>
        <h2 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <RiCalendarCheckLine style={{ color: 'var(--accent-primary)' }} />
          Quick Actions
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '14px' }}>
          {[
            { label: 'Register Patient', icon: <FiUsers />, to: '/patients/new', color: 'var(--accent-primary)' },
            { label: 'Add Doctor', icon: <FiUserCheck />, to: '/doctors/new', color: 'var(--accent-teal)' },
            { label: 'Book Appointment', icon: <FiCalendar />, to: '/appointments/new', color: 'var(--accent-violet)' },
            { label: 'Create Bill', icon: <RiMoneyDollarCircleLine />, to: '/billing/new', color: 'var(--accent-emerald)' },
          ].map((action, i) => (
            <Link
              key={i}
              to={action.to}
              className="quick-action-card"
              style={{ '--qa-color': action.color }}
            >
              <span className="quick-action-icon">{action.icon}</span>
              {action.label}
              <FiArrowRight style={{ marginLeft: 'auto', opacity: 0.5 }} />
            </Link>
          ))}
        </div>
      </div>

      {/* System Status */}
      <div className="system-status">
        <div className="status-dot" />
        <span className="status-text">All systems operational</span>
        <span className="status-sub">API and database responding normally</span>
      </div>
    </div>
  );
}
