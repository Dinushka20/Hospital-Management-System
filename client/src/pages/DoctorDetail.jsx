import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api/client';
import { FiEdit } from 'react-icons/fi';

export default function DoctorDetail() {
  const { id } = useParams();
  const [doctor, setDoctor] = useState(null);

  useEffect(() => { api.get(`/doctors/${id}`).then(res => setDoctor(res.data)); }, [id]);

  if (!doctor) return <div className="page-loader">Loading...</div>;

  return (
    <div className="page">
      <div className="page-header">
        <div><h1>{doctor.fullName}</h1><p>{doctor.specialization} — {doctor.departmentName}</p></div>
        <Link to={`/doctors/${id}/edit`} className="btn btn-primary"><FiEdit /> Edit</Link>
      </div>
      <div className="detail-grid">
        <div className="detail-card">
          <h3>Contact Info</h3>
          <div className="detail-row"><span>Phone</span><span>{doctor.phone || '—'}</span></div>
          <div className="detail-row"><span>Email</span><span>{doctor.email || '—'}</span></div>
          <div className="detail-row"><span>Department</span><span className="badge badge-info">{doctor.departmentName}</span></div>
        </div>
        <div className="detail-card">
          <h3>Appointments ({doctor.appointments?.length || 0})</h3>
          {doctor.appointments?.length > 0 ? (
            <div className="mini-table">
              {doctor.appointments.map(a => (
                <div key={a.id} className="mini-row">
                  <span>{new Date(a.appointmentDate).toLocaleDateString()}</span>
                  <span>{a.patientName}</span>
                  <span className={`badge badge-${a.status.toLowerCase()}`}>{a.status}</span>
                </div>
              ))}
            </div>
          ) : <p className="empty-state-sm">No appointments yet</p>}
        </div>
      </div>
    </div>
  );
}
