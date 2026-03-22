import { useState, useEffect } from 'react';
import api from '../api';
import { 
  Library, 
  BookCopy, 
  Users, 
  Activity, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  DollarSign 
} from 'lucide-react';

const MetricCard = ({ label, value, icon: Icon, color }) => (
  <div className="glass-card metric-card">
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
      <span className="metric-label">{label}</span>
      <div style={{ padding: '0.5rem', borderRadius: '12px', background: `${color}15`, color }}>
        <Icon size={20} />
      </div>
    </div>
    <span className="metric-value">{value}</span>
  </div>
);

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [borrows, setBorrows] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get('/dashboard'),
      api.get('/borrows', { params: { only_active: true } })
    ]).then(([stats, activeBorrows]) => {
      setData(stats);
      setBorrows(activeBorrows);
    }).catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div>Loading statistics...</div>;
  if (!data) return <div style={{ color: 'var(--danger)', padding: '2rem' }}>Error loading data. Please check your backend connection.</div>;

  return (
    <div className="animate-fade">
      <div className="metrics-grid">
        <MetricCard label="Total Sections" value={data.total_sections} icon={Library} color="#7c4dff" />
        <MetricCard label="Total Books" value={data.total_books} icon={BookCopy} color="#00e676" />
        <MetricCard label="Students" value={data.total_students} icon={Users} color="#00b0ff" />
        <MetricCard label="Active Borrows" value={data.active_borrows} icon={Activity} color="#ffd740" />
        
        <MetricCard label="Available Copies" value={data.available_books} icon={CheckCircle2} color="#00e676" />
        <MetricCard label="Out of Stock" value={data.out_of_stock_books} icon={XCircle} color="#ff5252" />
        <MetricCard label="Overdue" value={data.overdue_borrows} icon={AlertTriangle} color="#ffab40" />
        <MetricCard label="Outstanding Fines" value={`#${data.outstanding_fines.toFixed(2)}`} icon={DollarSign} color="#ff5252" />
      </div>

      <div className="glass-card">
        <h3 style={{ marginBottom: '1.5rem', fontSize: '1.25rem' }}>Current Borrowed Books</h3>
        <div className="table-container">
          {borrows.length > 0 ? (
            <table>
              <thead>
                <tr>
                  <th>Record #</th>
                  <th>Book Title</th>
                  <th>Student Name</th>
                  <th>Due Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {borrows.map(borrow => (
                  <tr key={borrow.id}>
                    <td>#{borrow.id}</td>
                    <td style={{ fontWeight: 600 }}>{borrow.book_title}</td>
                    <td>{borrow.student_name}</td>
                    <td>{new Date(borrow.due_at).toLocaleDateString()}</td>
                    <td>
                      <span className={`badge ${borrow.status === 'OVERDUE' ? 'badge-danger' : 'badge-warning'}`}>
                        {borrow.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
              No active borrow records found.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
