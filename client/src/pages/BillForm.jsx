import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/client';

export default function BillForm() {
  const navigate = useNavigate();
  const [patients, setPatients] = useState([]);
  const [form, setForm] = useState({ patientId: '', consultationCharge: 0, laboratoryCharge: 0, pharmacyCharge: 0, admissionCharge: 0 });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => { api.get('/patients').then(res => setPatients(res.data)); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      const payload = {
        patientId: parseInt(form.patientId),
        consultationCharge: parseFloat(form.consultationCharge) || 0,
        laboratoryCharge: parseFloat(form.laboratoryCharge) || 0,
        pharmacyCharge: parseFloat(form.pharmacyCharge) || 0,
        admissionCharge: parseFloat(form.admissionCharge) || 0,
      };
      await api.post('/billing', payload);
      navigate('/billing');
    } catch (err) { setError(err.response?.data?.message || 'Failed to create invoice.'); }
    finally { setLoading(false); }
  };

  const update = (field) => (e) => setForm({ ...form, [field]: e.target.value });
  const total = (parseFloat(form.consultationCharge) || 0) + (parseFloat(form.laboratoryCharge) || 0) + (parseFloat(form.pharmacyCharge) || 0) + (parseFloat(form.admissionCharge) || 0);

  return (
    <div className="page">
      <div className="page-header"><h1>Create Invoice</h1></div>
      {error && <div className="alert alert-error">{error}</div>}
      <div className="form-card">
        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-group full-width"><label>Patient</label>
              <select value={form.patientId} onChange={update('patientId')} required>
                <option value="">Select Patient</option>
                {patients.map(p => <option key={p.id} value={p.id}>{p.fullName}</option>)}
              </select>
            </div>
            <div className="form-group"><label>Consultation (LKR)</label><input type="number" step="0.01" min="0" value={form.consultationCharge} onChange={update('consultationCharge')} /></div>
            <div className="form-group"><label>Laboratory (LKR)</label><input type="number" step="0.01" min="0" value={form.laboratoryCharge} onChange={update('laboratoryCharge')} /></div>
            <div className="form-group"><label>Pharmacy (LKR)</label><input type="number" step="0.01" min="0" value={form.pharmacyCharge} onChange={update('pharmacyCharge')} /></div>
            <div className="form-group"><label>Admission (LKR)</label><input type="number" step="0.01" min="0" value={form.admissionCharge} onChange={update('admissionCharge')} /></div>
          </div>
          <div className="total-display">Total: <strong>LKR {total.toFixed(2)}</strong></div>
          <div className="form-actions">
            <button type="button" className="btn btn-secondary" onClick={() => navigate('/billing')}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={loading}>{loading ? 'Creating...' : 'Generate Invoice'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}
