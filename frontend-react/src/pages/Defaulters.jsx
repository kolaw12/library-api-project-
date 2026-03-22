import { useState, useEffect } from 'react';
import api from '../api';
import { AlertCircle, AlertTriangle, DollarSign, Users } from 'lucide-react';

export default function Defaulters() {
  const [defaulters, setDefaulters] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchDefaulters = () => {
    setLoading(true);
    api.get('/defaulters')
      .then(data => setDefaulters(data))
      .catch(err => alert(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchDefaulters();
  }, []);

  const totalOutstanding = (defaulters || []).reduce((sum, d) => sum + (d.outstanding_fine || 0), 0);

  return (
    <div className="animate-fade">
      <div className="metrics-grid" style={{ marginBottom: '2.5rem' }}>
        <div className="glass-card metric-card" style={{ background: 'rgba(255, 82, 82, 0.1)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <span className="metric-label" style={{ color: 'var(--danger)', fontWeight: 600 }}>Total Outstanding Fine</span>
            <DollarSign size={24} color="var(--danger)" />
          </div>
          <span className="metric-value">#{totalOutstanding.toFixed(2)}</span>
        </div>
        <div className="glass-card metric-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <span className="metric-label">Defaulters Count</span>
            <Users size={24} color="var(--accent)" />
          </div>
          <span className="metric-value">{defaulters.length}</span>
        </div>
      </div>

      <div className="glass-card">
        <h3 style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}><AlertTriangle size={20} color="var(--danger)"/> Student Defaulters Directory</h3>
        <div className="table-container">
          {loading ? (
            <div style={{ padding: '2rem', textAlign: 'center' }}>Syncing financial records...</div>
          ) : (defaulters || []).length > 0 ? (
            <table>
              <thead>
                <tr>
                  <th>Student Name</th>
                  <th>Matric Number</th>
                  <th>Overdue Count</th>
                  <th>Outstanding Fine</th>
                </tr>
              </thead>
              <tbody>
                {(defaulters || []).map((defaulter, idx) => (
                  <tr key={idx}>
                    <td style={{ fontWeight: 600 }}>{defaulter.student_name}</td>
                    <td>{defaulter.matric_number}</td>
                    <td>{defaulter.overdue_count} borrowed books</td>
                    <td style={{ fontWeight: 700, color: 'var(--danger)' }}>#{defaulter.outstanding_fine.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
              <AlertCircle size={40} style={{ opacity: 0.1, marginBottom: '1rem' }} />
              <p>Excellent! No student has outstanding fines.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
