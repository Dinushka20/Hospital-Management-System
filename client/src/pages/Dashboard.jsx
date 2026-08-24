import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/client';
import { useAuth } from '../context/AuthContext';
import {
  FiUsers, FiUserCheck, FiCalendar, FiAlertCircle,
  FiArrowRight,
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
      <div className="spinner" style={{ borderColor: '#e2e8f0', borderTopColor: 'var(--accent-primary)', width: 24, height: 24 }} />
      Loading dashboard...
    </div>
  );

  const cards = [
    {
      icon: <FiUsers />,
      label: 'Total Patients',
      value: stats?.totalPatients ?? 0,
      color: '#0d9488',
      bg: '#ccfbf1',
      sub: 'Registered in system',
    },
    {
      icon: <FiUserCheck />,
      label: 'Total Doctors',
      value: stats?.totalDoctors ?? 0,
      color: '#7c3aed',
      bg: '#ede9fe',
      sub: 'Active physicians',
    },
    {
      icon: <FiCalendar />,
      label: "Today's Appointments",
      value: stats?.todaysAppointments ?? 0,
      color: '#2563eb',
      bg: '#dbeafe',
      sub: 'Scheduled for today',
    },
    {
      icon: <RiMoneyDollarCircleLine />,
      label: 'Revenue This Month',
      value: `LKR ${(stats?.revenueThisMonth ?? 0).toLocaleString('en-LK')}`,
      color: '#059669',
      bg: '#d1fae5',
      sub: 'Billing collected',
    },
    {
      icon: <FiAlertCircle />,
      label: 'Outstanding Balance',
      value: `LKR ${(stats?.outstandingBalance ?? 0).toLocaleString('en-LK')}`,
      color: '#dc2626',
      bg: '#fee2e2',
      sub: 'Pending payments',
    },
  ];

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';
  const firstName = user?.fullName?.split(' ')[0] || 'Doctor';

  const quickActions = [
    { label: 'Register Patient', icon: <FiUsers />, to: '/patients/new', color: '#0d9488', bg: '#f0fdfa' },
    { label: 'Add Doctor', icon: <FiUserCheck />, to: '/doctors/new', color: '#7c3aed', bg: '#f5f3ff' },
    { label: 'Book Appointment', icon: <FiCalendar />, to: '/appointments/new', color: '#2563eb', bg: '#eff6ff' },
    { label: 'Create Bill', icon: <RiMoneyDollarCircleLine />, to: '/billing/new', color: '#059669', bg: '#ecfdf5' },
  ];

  return (
    <div className="page">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1>
            <RiHeartPulseLine style={{ color: '#dc2626', fontSize: '1.5rem', verticalAlign: 'middle' }} />
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
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div style={{ marginTop: '8px' }}>
        <h2 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px', color: '#1a202c' }}>
          <RiCalendarCheckLine style={{ color: '#0d9488' }} />
          Quick Actions
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '14px' }}>
          {quickActions.map((action, i) => (
            <Link
              key={i}
              to={action.to}
              style={{
                display: 'flex', alignItems: 'center', gap: '12px',
                padding: '18px 20px',
                background: action.bg,
                border: `1.5px solid ${action.color}30`,
                borderRadius: '14px',
                textDecoration: 'none',
                color: action.color,
                fontWeight: 700, fontSize: '0.85rem',
                transition: 'all 0.2s ease',
              }}
              onMouseOver={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = `0 6px 20px ${action.color}20`; }}
              onMouseOut={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = ''; }}
            >
              <span style={{ fontSize: '1.3rem' }}>{action.icon}</span>
              <span>{action.label}</span>
              <FiArrowRight style={{ marginLeft: 'auto', opacity: 0.5, fontSize: '0.9rem' }} />
            </Link>
          ))}
        </div>
      </div>

      {/* System Status */}
      <div style={{
        marginTop: '28px', padding: '14px 20px',
        background: '#ecfdf5',
        border: '1.5px solid #a7f3d0',
        borderRadius: '14px',
        display: 'flex', alignItems: 'center', gap: '12px',
      }}>
        <div style={{
          width: '10px', height: '10px', borderRadius: '50%',
          background: '#059669',
          boxShadow: '0 0 8px #059669',
          animation: 'pulse-dot 2s infinite',
        }} />
        <style>{`@keyframes pulse-dot { 0%,100%{opacity:1} 50%{opacity:0.5} }`}</style>
        <span style={{ fontSize: '0.85rem', color: '#059669', fontWeight: 700 }}>
          All systems operational
        </span>
        <span style={{ fontSize: '0.8rem', color: '#6b7280' }}>
          — API and database responding normally
        </span>
      </div>
    </div>
  );
}
