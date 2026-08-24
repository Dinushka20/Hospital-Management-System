import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../api/client';

export default function PatientForm() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const [form, setForm] = useState({ fullName: '', dateOfBirth: '', gender: 'Male', phone: '', address: '', bloodGroup: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isEdit) {
      api.get(`/patients/${id}`).then(res => {
        const p = res.data;
        setForm({ fullName: p.fullName, dateOfBirth: p.dateOfBirth?.split('T')[0] || '', gender: p.gender, phone: p.phone || '', address: p.address || '', bloodGroup: p.bloodGroup || '' });
      });
    }
  }, [id, isEdit]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      if (isEdit) { await api.put(`/patients/${id}`, form); }
      else { await api.post('/patients', form); }
      navigate('/patients');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save patient.');
    } finally { setLoading(false); }
  };

  const update = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  return (
    <div className="page">
      <div className="page-header"><h1>{isEdit ? 'Edit Patient' : 'Register Patient'}</h1></div>
      {error && <div className="alert alert-error">{error}</div>}
      <div className="form-card">
        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-group"><label>Full Name</label><input type="text" value={form.fullName} onChange={update('fullName')} required /></div>
            <div className="form-group"><label>Date of Birth</label><input type="date" value={form.dateOfBirth} onChange={update('dateOfBirth')} required /></div>
            <div className="form-group"><label>Gender</label>
              <select value={form.gender} onChange={update('gender')}><option>Male</option><option>Female</option><option>Other</option></select>
            </div>
            <div className="form-group"><label>Phone</label><input type="tel" value={form.phone} onChange={update('phone')} /></div>
            <div className="form-group"><label>Blood Group</label>
              <select value={form.bloodGroup} onChange={update('bloodGroup')}><option value="">—</option><option>A+</option><option>A-</option><option>B+</option><option>B-</option><option>AB+</option><option>AB-</option><option>O+</option><option>O-</option></select>
            </div>
            <div className="form-group full-width"><label>Address</label><textarea value={form.address} onChange={update('address')} rows="2" /></div>
          </div>
          <div className="form-actions">
            <button type="button" className="btn btn-secondary" onClick={() => navigate('/patients')}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={loading}>{loading ? 'Saving...' : isEdit ? 'Update Patient' : 'Register Patient'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}
