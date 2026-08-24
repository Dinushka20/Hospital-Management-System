import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/client';
import { FiPlus, FiXCircle } from 'react-icons/fi';

export default function Appointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAppointments = () => { api.get('/appointments').then(res => { setAppointments(res.data); setLoading(false); }).catch(() => setLoading(false)); };
  useEffect(() => { fetchAppointments(); }, []);

  const handleCancel = async (id) => {
    if (!confirm('Cancel this appointment?')) return;
    await api.post(`/appointments/${id}/cancel`);
    fetchAppointments();
  };

  return (
    <div className="page">
      <div className="page-header">
        <div><h1>Appointments</h1><p>Manage appointments</p></div>
        <Link to="/appointments/new" className="btn btn-primary"><FiPlus /> Book Appointment</Link>
      </div>
      {loading ? <div className="page-loader">Loading...</div> : (
        <div className="table-container">
          <table>
            <thead><tr><th>Date</th><th>Patient</th><th>Doctor</th><th>Reason</th><th>Status</th><th>Actions</th></tr></thead>
            <tbody>
              {appointments.map(a => (
                <tr key={a.id}>
                  <td>{new Date(a.appointmentDate).toLocaleString()}</td>
                  <td className="fw-medium">{a.patientName}</td>
                  <td>{a.doctorName}</td>
                  <td>{a.reason}</td>
                  <td><span className={`badge badge-${a.status.toLowerCase()}`}>{a.status}</span></td>
                  <td className="actions">
                    <Link to={`/appointments/${a.id}/edit`} className="btn-icon" title="Edit">✏️</Link>
                    {a.status !== 'Cancelled' && (
                      <button className="btn-icon danger" onClick={() => handleCancel(a.id)} title="Cancel"><FiXCircle /></button>
                    )}
                  </td>
                </tr>
              ))}
              {appointments.length === 0 && <tr><td colSpan="6" className="empty-state">No appointments found</td></tr>}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
