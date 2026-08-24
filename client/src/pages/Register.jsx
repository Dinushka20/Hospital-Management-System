import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiMail, FiLock, FiUser, FiShield, FiArrowRight, FiUserPlus } from 'react-icons/fi';
import { RiHospitalLine, RiTeamLine, RiShieldCheckLine, RiStethoscopeLine } from 'react-icons/ri';

const roles = ['Doctor', 'Nurse', 'Receptionist', 'LabStaff', 'Pharmacist', 'Accountant'];

export default function Register() {
  const [form, setForm] = useState({ fullName: '', email: '', password: '', role: 'Receptionist' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await register(form.fullName, form.email, form.password, form.role);
      navigate('/');
    } catch (err) {
      const errors = err.response?.data?.errors;
      setError(errors ? errors.join(', ') : 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  const update = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  return (
    <div className="auth-page">
      {/* Left Panel */}
      <div className="auth-left">
        <div className="auth-hero-icon"><FiUserPlus /></div>
        <h2>Join the<br />MediCore Team</h2>
        <p>Create your staff account to access the full hospital management suite.</p>
        <div className="auth-features">
          {[
            { icon: <RiStethoscopeLine />, color: '#3b82f6', bg: 'rgba(59,130,246,0.12)', text: 'Role-based dashboard access' },
            { icon: <RiTeamLine />, color: '#8b5cf6', bg: 'rgba(139,92,246,0.12)', text: 'Collaborate with your team' },
            { icon: <RiShieldCheckLine />, color: '#10b981', bg: 'rgba(16,185,129,0.12)', text: 'Encrypted & secure credentials' },
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
            <h1>Create Account</h1>
            <p>Register a new staff account</p>
          </div>

          {error && (
            <div className="alert alert-error">
              <FiShield style={{ flexShrink: 0 }} /> {error}
            </div>
          )}

          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label"><FiUser /> Full Name</label>
              <div className="input-wrap">
                <FiUser className="input-icon" />
                <input
                  className="form-control"
                  type="text"
                  value={form.fullName}
                  onChange={update('fullName')}
                  placeholder="John Doe"
                  required
                  style={{ paddingLeft: '42px' }}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label"><FiMail /> Email address</label>
              <div className="input-wrap">
                <FiMail className="input-icon" />
                <input
                  className="form-control"
                  type="email"
                  value={form.email}
                  onChange={update('email')}
                  placeholder="you@hospital.com"
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
                  value={form.password}
                  onChange={update('password')}
                  placeholder="Min 8 characters"
                  required
                  style={{ paddingLeft: '42px' }}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label"><FiShield /> Role</label>
              <select className="form-control" value={form.role} onChange={update('role')}>
                {roles.map(r => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>

            <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
              {loading ? <><div className="spinner" /> Creating account...</> : <>Create Account <FiArrowRight /></>}
            </button>
          </form>

          <div className="auth-footer">
            Already have an account? <Link to="/login">Sign in</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
