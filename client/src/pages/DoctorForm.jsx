import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../api/client';

export default function DoctorForm() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const [form, setForm] = useState({ fullName: '', specialization: '', phone: '', email: '', departmentId: '' });
  const [departments, setDepartments] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api.get('/departments').then(res => setDepartments(res.data));
    if (isEdit) {
      api.get(`/doctors/${id}`).then(res => {
        const d = res.data;
        setForm({ fullName: d.fullName, specialization: d.specialization, phone: d.phone || '', email: d.email || '', departmentId: d.departmentId });
      });
    }
  }, [id, isEdit]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      const payload = { ...form, departmentId: parseInt(form.departmentId) };
      if (isEdit) { await api.put(`/doctors/${id}`, payload); }
      else { await api.post('/doctors', payload); }
      navigate('/doctors');
    } catch (err) { setError(err.response?.data?.message || 'Failed to save.'); }
    finally { setLoading(false); }
  };

  const update = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  return (
    <div className="page">
      <div className="page-header"><h1>{isEdit ? 'Edit Doctor' : 'Add Doctor'}</h1></div>
      {error && <div className="alert alert-error">{error}</div>}
      <div className="form-card">
        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-group"><label>Full Name</label><input type="text" value={form.fullName} onChange={update('fullName')} required /></div>
            <div className="form-group"><label>Specialization</label><input type="text" value={form.specialization} onChange={update('specialization')} required /></div>
            <div className="form-group"><label>Department</label>
              <select value={form.departmentId} onChange={update('departmentId')} required>
                <option value="">Select Department</option>
                {departments.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
              </select>
            </div>
            <div className="form-group"><label>Phone</label><input type="tel" value={form.phone} onChange={update('phone')} /></div>
            <div className="form-group"><label>Email</label><input type="email" value={form.email} onChange={update('email')} /></div>
          </div>
          <div className="form-actions">
            <button type="button" className="btn btn-secondary" onClick={() => navigate('/doctors')}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={loading}>{loading ? 'Saving...' : isEdit ? 'Update' : 'Add Doctor'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}
