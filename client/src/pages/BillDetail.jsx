import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api/client';

export default function BillDetail() {
  const { id } = useParams();
  const [bill, setBill] = useState(null);
  const [payAmount, setPayAmount] = useState('');
  const [message, setMessage] = useState('');

  const fetchBill = () => { api.get(`/billing/${id}`).then(res => setBill(res.data)); };
  useEffect(() => { fetchBill(); }, [id]);

  const handlePay = async (e) => {
    e.preventDefault();
    const amount = parseFloat(payAmount);
    if (!amount || amount <= 0) return;
    try {
      const res = await api.post(`/billing/${id}/pay`, { amount });
      setMessage(res.data.message);
      setPayAmount('');
      fetchBill();
    } catch { setMessage('Payment failed.'); }
  };

  if (!bill) return <div className="page-loader">Loading...</div>;

  return (
    <div className="page">
      <div className="page-header">
        <div><h1>Invoice INV-{String(bill.id).padStart(4, '0')}</h1><p>{bill.patientName} — {new Date(bill.billDate).toLocaleDateString()}</p></div>
        <span className={`badge badge-lg badge-${bill.status.toLowerCase()}`}>{bill.status}</span>
      </div>
      <div className="detail-grid">
        <div className="detail-card">
          <h3>Line Items</h3>
          <div className="table-container">
            <table>
              <thead><tr><th>Description</th><th>Amount</th></tr></thead>
              <tbody>
                {bill.items.map(i => (
                  <tr key={i.id}><td>{i.description}</td><td>LKR {i.amount.toFixed(2)}</td></tr>
                ))}
                <tr className="total-row"><td><strong>Total</strong></td><td><strong>LKR {bill.totalAmount.toFixed(2)}</strong></td></tr>
              </tbody>
            </table>
          </div>
        </div>
        <div className="detail-card">
          <h3>Payment Summary</h3>
          <div className="detail-row"><span>Total</span><span>LKR {bill.totalAmount.toFixed(2)}</span></div>
          <div className="detail-row"><span>Paid</span><span className="text-green">LKR {bill.amountPaid.toFixed(2)}</span></div>
          <div className="detail-row"><span>Balance</span><span className="text-red">LKR {bill.balance.toFixed(2)}</span></div>
          {bill.status !== 'Paid' && (
            <form onSubmit={handlePay} className="pay-form">
              <input type="number" step="0.01" min="0.01" placeholder="Payment amount" value={payAmount} onChange={(e) => setPayAmount(e.target.value)} required />
              <button type="submit" className="btn btn-primary">Record Payment</button>
            </form>
          )}
          {message && <div className="alert alert-success">{message}</div>}
        </div>
      </div>
    </div>
  );
}
