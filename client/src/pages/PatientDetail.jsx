import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api/client';
import { FiEdit } from 'react-icons/fi';

export default function PatientDetail() {
  const { id } = useParams();
  const [patient, setPatient] = useState(null);

  useEffect(() => { api.get(`/patients/${id}`).then(res => setPatient(res.data)); }, [id]);

  if (!patient) return <div className="page-loader">Loading...</div>;

  return (
    <div className="page">
      <div className="page-header">
        <div><h1>{patient.fullName}</h1><p>Patient Details</p></div>
        <Link to={`/patients/${id}/edit`} className="btn btn-primary"><FiEdit /> Edit</Link>
      </div>
      <div className="detail-grid">
        <div className="detail-card">
          <h3>Personal Info</h3>
          <div className="detail-row"><span>Gender</span><span>{patient.gender}</span></div>
          <div className="detail-row"><span>DOB</span><span>{new Date(patient.dateOfBirth).toLocaleDateString()}</span></div>
          <div className="detail-row"><span>Phone</span><span>{patient.phone || '—'}</span></div>
          <div className="detail-row"><span>Blood Group</span><span className="badge">{patient.bloodGroup || '—'}</span></div>
          <div className="detail-row"><span>Address</span><span>{patient.address || '—'}</span></div>
          <div className="detail-row"><span>Registered</span><span>{new Date(patient.registeredOn).toLocaleDateString()}</span></div>
        </div>
        <div className="detail-card">
          <h3>Appointments ({patient.appointments?.length || 0})</h3>
          {patient.appointments?.length > 0 ? (
            <div className="mini-table">
              {patient.appointments.map(a => (
                <div key={a.id} className="mini-row">
                  <span>{new Date(a.appointmentDate).toLocaleDateString()}</span>
                  <span>{a.doctorName}</span>
                  <span className={`badge badge-${a.status.toLowerCase()}`}>{a.status}</span>
                </div>
              ))}
            </div>
          ) : <p className="empty-state-sm">No appointments yet</p>}
        </div>
        <div className="detail-card">
          <h3>Bills ({patient.bills?.length || 0})</h3>
          {patient.bills?.length > 0 ? (
            <div className="mini-table">
              {patient.bills.map(b => (
                <div key={b.id} className="mini-row">
                  <span>{new Date(b.billDate).toLocaleDateString()}</span>
                  <span>${b.totalAmount}</span>
                  <span className={`badge badge-${b.status.toLowerCase()}`}>{b.status}</span>
                </div>
              ))}
            </div>
          ) : <p className="empty-state-sm">No bills yet</p>}
        </div>
      </div>
    </div>
  );
}
