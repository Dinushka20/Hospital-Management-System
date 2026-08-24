import { useEffect, useState } from 'react';
import api from '../api/client';
import { useAuth } from '../context/AuthContext';
import {
  FiUsers, FiUserCheck, FiCalendar, FiTrendingUp, FiAlertCircle,
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
      bg: 'rgba(59,130,246,0.1)',
      trend: 'Registered patients',
    },
    {
      icon: <FiUserCheck />,
      label: 'Total Doctors',
      value: stats?.totalDoctors ?? 0,
      color: 'var(--accent-teal)',
      bg: 'rgba(20,184,166,0.1)',
      trend: 'Active physicians',
    },
    {
      icon: <FiCalendar />,
      label: "Today's Appointments",
      value: stats?.todaysAppointments ?? 0,
      color: 'var(--accent-violet)',
      bg: 'rgba(139,92,246,0.1)',
      trend: 'Scheduled for today',
    },
    {
      icon: <RiMoneyDollarCircleLine />,
      label: 'Revenue This Month',
      value: `$${(stats?.revenueThisMonth ?? 0).toLocaleString()}`,
      color: 'var(--accent-emerald)',
      bg: 'rgba(16,185,129,0.1)',
      trend: 'Billing collected',
    },
    {
      icon: <FiAlertCircle />,
      label: 'Outstanding Balance',
      value: `$${(stats?.outstandingBalance ?? 0).toLocaleString()}`,
      color: 'var(--accent-amber)',
      bg: 'rgba(245,158,11,0.1)',
      trend: 'Pending payments',
    },
  ];

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  return (
    <div className="page">
      {/* Header */}
      <div className="page-header" style={{ marginBottom: '32px' }}>
        <div>
          <h1 style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <RiHeartPulseLine style={{ color: 'var(--accent-red)', fontSize: '1.6rem' }} />
            {greeting}, {user?.fullName?.split(' ')[0] || 'Doctor'} 👋
          </h1>
          <p style={{ marginTop: '6px' }}>
            Here's your hospital overview for {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        {cards.map((card, i) => (
          <div
            key={i}
            className="stat-card"
            style={{ '--card-accent': card.color }}
          >
            <div className="stat-icon" style={{ background: card.bg, color: card.color }}>
              {card.icon}
            </div>
            <div className="stat-info">
              <span className="stat-value">{card.value}</span>
              <span className="stat-label">{card.label}</span>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                {card.trend}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div style={{ marginTop: '12px' }}>
        <h2 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <RiCalendarCheckLine style={{ color: 'var(--accent-primary)' }} />
          Quick Actions
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '14px' }}>
          {[
            { label: 'Register Patient', icon: <FiUsers />, to: '/patients/new', color: 'var(--accent-primary)', bg: 'rgba(59,130,246,0.06)' },
            { label: 'Add Doctor', icon: <FiUserCheck />, to: '/doctors/new', color: 'var(--accent-teal)', bg: 'rgba(20,184,166,0.06)' },
            { label: 'Book Appointment', icon: <FiCalendar />, to: '/appointments/new', color: 'var(--accent-violet)', bg: 'rgba(139,92,246,0.06)' },
            { label: 'Create Bill', icon: <RiMoneyDollarCircleLine />, to: '/billing/new', color: 'var(--accent-emerald)', bg: 'rgba(16,185,129,0.06)' },
          ].map((action, i) => (
            <a
              key={i}
              href={action.to}
              style={{
                display: 'flex', alignItems: 'center', gap: '14px',
                padding: '18px 20px',
                background: action.bg,
                border: `1px solid ${action.color}22`,
                borderRadius: 'var(--radius-lg)',
                textDecoration: 'none',
                color: action.color,
                fontWeight: 600, fontSize: '0.875rem',
                transition: 'var(--transition)',
              }}
              onMouseOver={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = `0 8px 24px ${action.color}22`; }}
              onMouseOut={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = ''; }}
            >
              <span style={{ fontSize: '1.3rem' }}>{action.icon}</span>
              {action.label}
            </a>
          ))}
        </div>
      </div>

      {/* System Status */}
      <div style={{
        marginTop: '28px', padding: '16px 20px',
        background: 'rgba(16,185,129,0.06)',
        border: '1px solid rgba(16,185,129,0.15)',
        borderRadius: 'var(--radius-lg)',
        display: 'flex', alignItems: 'center', gap: '12px',
      }}>
        <div style={{
          width: '10px', height: '10px', borderRadius: '50%',
          background: 'var(--accent-emerald)',
          boxShadow: '0 0 8px var(--accent-emerald)',
          animation: 'pulse-dot 2s infinite',
        }} />
        <style>{`@keyframes pulse-dot { 0%,100%{opacity:1} 50%{opacity:0.5} }`}</style>
        <span style={{ fontSize: '0.875rem', color: 'var(--accent-emerald)', fontWeight: 600 }}>
          All systems operational
        </span>
        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginLeft: '4px' }}>
          — API and database are responding normally
        </span>
      </div>
    </div>
  );
}
