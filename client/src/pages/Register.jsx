import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiActivity, FiMail, FiLock, FiUser, FiShield } from 'react-icons/fi';

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
      <div className="auth-card">
        <div className="auth-header">
          <FiActivity className="auth-logo" />
          <h1>Create Account</h1>
          <p>Register a new staff account</p>
        </div>
        {error && <div className="alert alert-error">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label><FiUser /> Full Name</label>
            <input type="text" value={form.fullName} onChange={update('fullName')} placeholder="John Doe" required />
          </div>
          <div className="form-group">
            <label><FiMail /> Email</label>
            <input type="email" value={form.email} onChange={update('email')} placeholder="john@hms.local" required />
          </div>
          <div className="form-group">
            <label><FiLock /> Password</label>
            <input type="password" value={form.password} onChange={update('password')} placeholder="Min 8 characters" required />
          </div>
          <div className="form-group">
            <label><FiShield /> Role</label>
            <select value={form.role} onChange={update('role')}>
              {roles.map(r => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>
          <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
            {loading ? 'Creating...' : 'Create Account'}
          </button>
        </form>
        <p className="auth-footer">
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
