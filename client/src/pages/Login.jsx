import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiMail, FiLock, FiArrowRight } from 'react-icons/fi';
import {
  RiHospitalLine, RiShieldCheckLine,
  RiHeartPulseLine, RiTeamLine
} from 'react-icons/ri';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setLoading(true);
    try {
      await login(form.email, form.password);
      navigate('/');
    } catch {
      setError('Invalid email or password. Please try again.');
    } finally { setLoading(false); }
  };

  return (
    <div className="auth-page">
      {/* Left Panel */}
      <div className="auth-left">
        <div className="auth-hero-icon"><RiHospitalLine /></div>
        <h2>Smarter Hospital<br />Management System</h2>
        <p>A unified platform to manage patients, doctors, appointments, and billing — all in one place.</p>
        <div className="auth-features">
          {[
            { icon: <RiHeartPulseLine />, color: '#f43f5e', bg: 'rgba(244,63,94,0.12)', text: 'Real-time patient monitoring & records' },
            { icon: <FiMail />, color: '#3b82f6', bg: 'rgba(59,130,246,0.12)', text: 'Instant appointment scheduling' },
            { icon: <RiShieldCheckLine />, color: '#10b981', bg: 'rgba(16,185,129,0.12)', text: 'Secure, role-based access control' },
            { icon: <RiTeamLine />, color: '#8b5cf6', bg: 'rgba(139,92,246,0.12)', text: 'Multi-role staff management' },
          ].map((f, i) => (
            <div key={i} className="auth-feature">
              <div className="auth-feature-icon" style={{ background: f.bg, color: f.color }}>{f.icon}</div>
              <span className="auth-feature-text">{f.text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Right Panel */}
      <div className="auth-right">
        <div className="auth-card">
          <div className="auth-card-header">
            <div className="auth-logo-mini"><RiHospitalLine /></div>
            <h1>Welcome back</h1>
            <p>Sign in to your HMS account to continue</p>
          </div>

          {error && (
            <div className="alert alert-error">
              <FiLock style={{ flexShrink: 0 }} /> {error}
            </div>
          )}

          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label"><FiMail /> Email address</label>
              <div className="input-wrap">
                <FiMail className="input-icon" />
                <input
                  className="form-control"
                  type="email"
                  placeholder="you@hospital.com"
                  value={form.email}
                  onChange={e => setForm({ ...form, email: e.target.value })}
                  required
                  style={{ paddingLeft: '42px' }}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label"><FiLock /> Password</label>
              <div className="input-wrap">
                <FiLock className="input-icon" />
                <input
                  className="form-control"
                  type="password"
                  placeholder="••••••••"
                  value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })}
                  required
                  style={{ paddingLeft: '42px' }}
                />
              </div>
            </div>

            <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
              {loading ? <><div className="spinner" /> Signing in...</> : <>Sign In <FiArrowRight /></>}
            </button>
          </form>

          <div className="auth-footer">
            Don't have an account? <Link to="/register">Create one</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
