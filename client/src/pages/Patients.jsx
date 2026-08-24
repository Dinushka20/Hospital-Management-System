import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/client';
import { FiPlus, FiSearch, FiEye, FiEdit, FiTrash2 } from 'react-icons/fi';

export default function Patients() {
  const [patients, setPatients] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchPatients = (q = '') => {
    setLoading(true);
    api.get(`/patients${q ? `?search=${q}` : ''}`).then(res => { setPatients(res.data); setLoading(false); }).catch(() => setLoading(false));
  };

  useEffect(() => { fetchPatients(); }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchPatients(search);
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this patient?')) return;
    await api.delete(`/patients/${id}`);
    fetchPatients(search);
  };

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>Patients</h1>
          <p>Manage patient records</p>
        </div>
        <Link to="/patients/new" className="btn btn-primary"><FiPlus /> Add Patient</Link>
      </div>
      <form className="search-bar" onSubmit={handleSearch}>
        <FiSearch />
        <input type="text" placeholder="Search by name or phone..." value={search} onChange={(e) => setSearch(e.target.value)} />
        <button type="submit" className="btn btn-secondary">Search</button>
      </form>
      {loading ? <div className="page-loader">Loading...</div> : (
        <div className="table-container">
          <table>
            <thead>
              <tr><th>Name</th><th>Gender</th><th>Phone</th><th>Blood Group</th><th>Registered</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {patients.map(p => (
                <tr key={p.id}>
                  <td className="fw-medium">{p.fullName}</td>
                  <td>{p.gender}</td>
                  <td>{p.phone || '—'}</td>
                  <td><span className="badge">{p.bloodGroup || '—'}</span></td>
                  <td>{new Date(p.registeredOn).toLocaleDateString()}</td>
                  <td className="actions">
                    <Link to={`/patients/${p.id}`} className="btn-icon" title="View"><FiEye /></Link>
                    <Link to={`/patients/${p.id}/edit`} className="btn-icon" title="Edit"><FiEdit /></Link>
                    <button className="btn-icon danger" onClick={() => handleDelete(p.id)} title="Delete"><FiTrash2 /></button>
                  </td>
                </tr>
              ))}
              {patients.length === 0 && <tr><td colSpan="6" className="empty-state">No patients found</td></tr>}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
