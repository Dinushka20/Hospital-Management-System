import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../api/client';

export default function AppointmentForm() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const [form, setForm] = useState({ patientId: '', doctorId: '', appointmentDate: '', reason: '', notes: '', status: 'Scheduled' });
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api.get('/patients').then(res => setPatients(res.data));
    api.get('/doctors').then(res => setDoctors(res.data));
    if (isEdit) {
      api.get('/appointments').then(res => {
        const a = res.data.find(x => x.id === parseInt(id));
        if (a) setForm({ patientId: a.patientId, doctorId: a.doctorId, appointmentDate: a.appointmentDate?.slice(0, 16) || '', reason: a.reason, notes: a.notes || '', status: a.status });
      });
    }
  }, [id, isEdit]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      const payload = { ...form, patientId: parseInt(form.patientId), doctorId: parseInt(form.doctorId) };
      if (isEdit) { await api.put(`/appointments/${id}`, payload); }
      else { await api.post('/appointments', payload); }
      navigate('/appointments');
    } catch (err) { setError(err.response?.data?.message || 'Failed to save.'); }
    finally { setLoading(false); }
  };

  const update = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  return (
    <div className="page">
      <div className="page-header"><h1>{isEdit ? 'Edit Appointment' : 'Book Appointment'}</h1></div>
      {error && <div className="alert alert-error">{error}</div>}
      <div className="form-card">
        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-group"><label>Patient</label>
              <select value={form.patientId} onChange={update('patientId')} required>
                <option value="">Select Patient</option>
                {patients.map(p => <option key={p.id} value={p.id}>{p.fullName}</option>)}
              </select>
            </div>
            <div className="form-group"><label>Doctor</label>
              <select value={form.doctorId} onChange={update('doctorId')} required>
                <option value="">Select Doctor</option>
                {doctors.map(d => <option key={d.id} value={d.id}>{d.fullName} ({d.specialization})</option>)}
              </select>
            </div>
            <div className="form-group"><label>Date & Time</label><input type="datetime-local" value={form.appointmentDate} onChange={update('appointmentDate')} required /></div>
            <div className="form-group"><label>Reason</label><input type="text" value={form.reason} onChange={update('reason')} required /></div>
            {isEdit && (
              <div className="form-group"><label>Status</label>
                <select value={form.status} onChange={update('status')}>
                  <option>Scheduled</option><option>Completed</option><option>Cancelled</option>
                </select>
              </div>
            )}
            <div className="form-group full-width"><label>Notes</label><textarea value={form.notes} onChange={update('notes')} rows="2" /></div>
          </div>
          <div className="form-actions">
            <button type="button" className="btn btn-secondary" onClick={() => navigate('/appointments')}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={loading}>{loading ? 'Saving...' : isEdit ? 'Update' : 'Book Appointment'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}
