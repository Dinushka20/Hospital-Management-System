import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/client';
import { FiPlus, FiEye } from 'react-icons/fi';

export default function Billing() {
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { api.get('/billing').then(res => { setBills(res.data); setLoading(false); }).catch(() => setLoading(false)); }, []);

  return (
    <div className="page">
      <div className="page-header">
        <div><h1>Billing</h1><p>Manage invoices & payments</p></div>
        <Link to="/billing/new" className="btn btn-primary"><FiPlus /> Create Invoice</Link>
      </div>
      {loading ? <div className="page-loader">Loading...</div> : (
        <div className="table-container">
          <table>
            <thead><tr><th>Invoice</th><th>Patient</th><th>Date</th><th>Total</th><th>Paid</th><th>Balance</th><th>Status</th><th>Actions</th></tr></thead>
            <tbody>
              {bills.map(b => (
                <tr key={b.id}>
                  <td className="fw-medium">INV-{String(b.id).padStart(4, '0')}</td>
                  <td>{b.patientName}</td>
                  <td>{new Date(b.billDate).toLocaleDateString()}</td>
                  <td>${b.totalAmount.toFixed(2)}</td>
                  <td>${b.amountPaid.toFixed(2)}</td>
                  <td>${b.balance.toFixed(2)}</td>
                  <td><span className={`badge badge-${b.status.toLowerCase()}`}>{b.status}</span></td>
                  <td className="actions">
                    <Link to={`/billing/${b.id}`} className="btn-icon" title="View"><FiEye /></Link>
                  </td>
                </tr>
              ))}
              {bills.length === 0 && <tr><td colSpan="8" className="empty-state">No invoices found</td></tr>}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
