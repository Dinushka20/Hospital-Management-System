import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/client';
import { FiPlus, FiEye, FiEdit, FiTrash2 } from 'react-icons/fi';

export default function Doctors() {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchDoctors = () => { api.get('/doctors').then(res => { setDoctors(res.data); setLoading(false); }).catch(() => setLoading(false)); };
  useEffect(() => { fetchDoctors(); }, []);

  const handleDelete = async (id) => {
    if (!confirm('Delete this doctor?')) return;
    await api.delete(`/doctors/${id}`);
    fetchDoctors();
  };

  return (
    <div className="page">
      <div className="page-header">
        <div><h1>Doctors</h1><p>Manage medical staff</p></div>
        <Link to="/doctors/new" className="btn btn-primary"><FiPlus /> Add Doctor</Link>
      </div>
      {loading ? <div className="page-loader">Loading...</div> : (
        <div className="table-container">
          <table>
            <thead><tr><th>Name</th><th>Specialization</th><th>Department</th><th>Phone</th><th>Email</th><th>Actions</th></tr></thead>
            <tbody>
              {doctors.map(d => (
                <tr key={d.id}>
                  <td className="fw-medium">{d.fullName}</td>
                  <td>{d.specialization}</td>
                  <td><span className="badge badge-info">{d.departmentName}</span></td>
                  <td>{d.phone || '—'}</td>
                  <td>{d.email || '—'}</td>
                  <td className="actions">
                    <Link to={`/doctors/${d.id}`} className="btn-icon" title="View"><FiEye /></Link>
                    <Link to={`/doctors/${d.id}/edit`} className="btn-icon" title="Edit"><FiEdit /></Link>
                    <button className="btn-icon danger" onClick={() => handleDelete(d.id)} title="Delete"><FiTrash2 /></button>
                  </td>
                </tr>
              ))}
              {doctors.length === 0 && <tr><td colSpan="6" className="empty-state">No doctors found</td></tr>}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
