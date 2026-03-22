import { useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import api from '../api';
import { Layers, Bookmark, CheckCircle2, XCircle } from 'lucide-react';

export default function SectionView() {
  const { id } = useParams();
  const location = useLocation();
  const sectionName = location.state?.sectionName || 'Sectional Inventory';
  
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    api.get('/books', { params: { section_id: id, include_out_of_stock: true } })
      .then(data => setBooks(data))
      .catch(err => alert(err))
      .finally(() => setLoading(false));
  }, [id]);

  const totalTitles = books.length;
  const availableTitles = books.filter(b => b.available_copies > 0).length;
  const outOfStock = totalTitles - availableTitles;

  return (
    <div className="animate-fade">
      <div className="metrics-grid">
        <div className="glass-card metric-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <span className="metric-label">Titles in {sectionName}</span>
            <Bookmark size={24} color="var(--accent)" />
          </div>
          <span className="metric-value">{totalTitles}</span>
        </div>
        <div className="glass-card metric-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <span className="metric-label">Available Titles</span>
            <CheckCircle2 size={24} color="var(--success)" />
          </div>
          <span className="metric-value">{availableTitles}</span>
        </div>
        <div className="glass-card metric-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <span className="metric-label">Out of Stock</span>
            <XCircle size={24} color="var(--danger)" />
          </div>
          <span className="metric-value">{outOfStock}</span>
        </div>
      </div>

      <div className="glass-card">
        <h3 style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}><Layers size={21} color="var(--accent)"/> Content of {sectionName}</h3>
        <div className="table-container">
          {loading ? (
            <div style={{ padding: '2rem', textAlign: 'center' }}>Syncing collection of {sectionName}...</div>
          ) : books.length > 0 ? (
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Title</th>
                  <th>Author</th>
                  <th>Version</th>
                  <th>Inventory</th>
                  <th>Cost</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {books.map(book => (
                  <tr key={book.id}>
                    <td>#{book.id}</td>
                    <td style={{ fontWeight: 600 }}>{book.title}</td>
                    <td style={{ fontSize: '0.9rem' }}>{book.author}</td>
                    <td style={{ fontSize: '0.85rem' }}>{book.version}</td>
                    <td>{book.available_copies} / {book.total_copies}</td>
                    <td>#{book.cost.toFixed(2)}</td>
                    <td>
                      <span className={`badge ${book.available_copies > 0 ? 'badge-success' : 'badge-danger'}`}>
                        {book.available_copies > 0 ? 'AVAILABLE' : 'OUT OF STOCK'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
              No books registered in this section yet.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
