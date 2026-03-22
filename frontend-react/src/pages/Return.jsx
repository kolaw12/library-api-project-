import { useState, useEffect } from 'react';
import api from '../api';
import { RotateCcw, DollarSign, History, Search } from 'lucide-react';

export default function Return() {
  const [activeBorrows, setActiveBorrows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBorrowId, setSelectedBorrowId] = useState('');
  const [returnStatus, setReturnStatus] = useState(null);

  const fetchActiveBorrows = () => {
    setLoading(true);
    api.get('/borrows', { params: { only_active: true } })
      .then(data => setActiveBorrows(data))
      .catch(err => alert(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchActiveBorrows();
  }, []);

  const handleReturn = (e) => {
    e.preventDefault();
    if (!selectedBorrowId) return alert('Select a borrow record!');

    api.post(`/return/${selectedBorrowId}`)
      .then((data) => {
        setReturnStatus(data);
        alert(`Book returned successfully!\nFine Incurred: #${data.fine_amount.toFixed(2)}`);
        setSelectedBorrowId('');
        fetchActiveBorrows();
      })
      .catch(err => alert(err));
  };

  return (
    <div className="animate-fade" style={{ display: 'grid', gridTemplateColumns: 'minmax(450px, 500px) 1fr', gap: '2.5rem' }}>
      <div className="glass-card">
        <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}><RotateCcw size={20} color="var(--accent)"/> Return Process</h3>
        
        {loading ? (
          <div>Retrieving active records...</div>
        ) : activeBorrows.length === 0 ? (
          <div className="badge badge-success" style={{ display: 'block', padding: '1rem', textAlign: 'center' }}>Hooray! No books are currently out.</div>
        ) : (
          <form onSubmit={handleReturn}>
            <div className="form-group">
              <label>Select Borrow Record</label>
              <div style={{ position: 'relative' }}>
                <select value={selectedBorrowId} onChange={(e) => setSelectedBorrowId(e.target.value)} required>
                  <option value="">-- Choose Record to Return --</option>
                  {activeBorrows.map(record => (
                    <option key={record.id} value={record.id}>
                      Record #{record.id} | {record.student_name} {'->'} {record.book_title}
                    </option>
                  ))}
                </select>
                <Search style={{ position: 'absolute', right: '12px', top: '12px', opacity: 0.3 }} size={18} />
              </div>
            </div>

            {selectedBorrowId && (
              <div style={{ padding: '1rem', background: 'rgba(255, 255, 255, 0.05)', borderRadius: '12px', marginBottom: '1.5rem' }}>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Selected Record:</p>
                <p style={{ fontWeight: 600 }}>Due At: {new Date(activeBorrows.find(b => b.id == selectedBorrowId).due_at).toLocaleDateString()}</p>
                <p style={{ fontWeight: 600, color: activeBorrows.find(b => b.id == selectedBorrowId).status === 'OVERDUE' ? 'var(--danger)' : 'var(--success)' }}>
                  Status: {activeBorrows.find(b => b.id == selectedBorrowId).status}
                </p>
              </div>
            )}

            <button type="submit" style={{ width: '100%', marginTop: '1rem' }} disabled={!selectedBorrowId}>
              Confirm Return
            </button>
          </form>
        )}

        {returnStatus && (
          <div className="animate-fade" style={{ marginTop: '2rem', padding: '1.5rem', border: '1px solid var(--panel-border)', borderRadius: '16px', background: 'rgba(124, 77, 255, 0.1)' }}>
            <h4 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
              <CheckCircle size={18} color="var(--success)"/> Return Summary
            </h4>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <span>Fine Amount:</span>
              <span style={{ fontWeight: 700, color: returnStatus.fine_amount > 0 ? 'var(--danger)' : 'var(--success)' }}>#{returnStatus.fine_amount.toFixed(2)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Returned At:</span>
              <span style={{ fontWeight: 600 }}>{new Date(returnStatus.returned_at).toLocaleString()}</span>
            </div>
          </div>
        )}
      </div>

      <div className="glass-card">
        <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}><History size={20} color="var(--accent)"/> Recent Returns</h3>
        <div style={{ color: 'var(--text-secondary)', textAlign: 'center', padding: '2rem' }}>
          <DollarSign size={40} style={{ opacity: 0.1, marginBottom: '1rem' }} />
          <p>This view displays active borrows. To track historical returns, please use the Defaulters page or Sectional Inventory.</p>
        </div>
      </div>
    </div>
  );
}

const CheckCircle = ({ size, color }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
);
