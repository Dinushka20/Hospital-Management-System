import { useEffect, useState } from 'react';
import api from '../api/client';
import { FiUsers, FiUserPlus, FiCalendar, FiDollarSign, FiTrendingUp } from 'react-icons/fi';

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/dashboard/stats').then(res => { setStats(res.data); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  if (loading) return <div className="page-loader">Loading dashboard...</div>;

  const cards = [
    { icon: <FiUsers />, label: 'Total Patients', value: stats?.totalPatients || 0, color: 'var(--accent-blue)' },
    { icon: <FiUserPlus />, label: 'Total Doctors', value: stats?.totalDoctors || 0, color: 'var(--accent-green)' },
    { icon: <FiCalendar />, label: "Today's Appointments", value: stats?.todaysAppointments || 0, color: 'var(--accent-purple)' },
    { icon: <FiDollarSign />, label: 'Revenue This Month', value: `$${(stats?.revenueThisMonth || 0).toLocaleString()}`, color: 'var(--accent-orange)' },
    { icon: <FiTrendingUp />, label: 'Outstanding Balance', value: `$${(stats?.outstandingBalance || 0).toLocaleString()}`, color: 'var(--accent-red)' },
  ];

  return (
    <div className="page">
      <div className="page-header">
        <h1>Dashboard</h1>
        <p>Welcome back! Here's your hospital overview.</p>
      </div>
      <div className="stats-grid">
        {cards.map((card, i) => (
          <div key={i} className="stat-card" style={{ '--card-accent': card.color }}>
            <div className="stat-icon">{card.icon}</div>
            <div className="stat-info">
              <span className="stat-value">{card.value}</span>
              <span className="stat-label">{card.label}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
