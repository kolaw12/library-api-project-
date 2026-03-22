import { useState, useEffect } from 'react';
import api from '../api';
import { PlusCircle, Search, RefreshCw, Layers } from 'lucide-react';

export default function Books({ sections }) {
  const [activeTab, setActiveTab] = useState('view');
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sectionFilter, setSectionFilter] = useState('ALL');
  const [includeOutOfStock, setIncludeOutOfStock] = useState(true);

  // Form states
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [version, setVersion] = useState('');
  const [cost, setCost] = useState(0);
  const [totalCopies, setTotalCopies] = useState(1);
  const [sectionId, setSectionId] = useState('');

  // Restock states
  const [restockBookId, setRestockBookId] = useState('');
  const [addedCopies, setAddedCopies] = useState(1);

  const fetchBooks = () => {
    setLoading(true);
    const params = { include_out_of_stock: includeOutOfStock };
    if (sectionFilter !== 'ALL') {
      params.section_id = sectionFilter;
    }
    api.get('/books', { params })
      .then(data => setBooks(data))
      .catch(err => alert(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchBooks();
  }, [sectionFilter, includeOutOfStock]);

  const handleAddBook = (e) => {
    e.preventDefault();
    if (!sectionId) return alert('Select a section!');
    
    const payload = {
      title,
      author,
      version,
      cost: parseFloat(cost),
      total_copies: parseInt(totalCopies),
      section_id: parseInt(sectionId),
    };

    api.post('/books', payload)
      .then(() => {
        alert('Book added successfully!');
        setTitle('');
        setAuthor('');
        setVersion('');
        setCost(0);
        setTotalCopies(1);
        setActiveTab('view');
        fetchBooks();
      })
      .catch(err => alert(err));
  };

  const handleRestock = (e) => {
    e.preventDefault();
    if (!restockBookId) return alert('Select a book!');

    api.patch(`/books/${restockBookId}/stock`, { added_copies: parseInt(addedCopies) })
      .then(() => {
        alert('Book restocked successfully!');
        setRestockBookId('');
        setAddedCopies(1);
        fetchBooks();
      })
      .catch(err => alert(err));
  };

  const sectionsReady = sections.length > 0;

  return (
    <div className="animate-fade">
      <div className="tabs">
        <div className={`tab ${activeTab === 'view' ? 'active' : ''}`} onClick={() => setActiveTab('view')}>
          View Inventory
        </div>
        <div className={`tab ${activeTab === 'add' ? 'active' : ''}`} onClick={() => setActiveTab('add')}>
          Add New Book
        </div>
        <div className={`tab ${activeTab === 'restock' ? 'active' : ''}`} onClick={() => setActiveTab('restock')}>
          Restock Book
        </div>
      </div>

      {activeTab === 'add' && (
        <div className="glass-card animate-fade">
          <h3 style={{ marginBottom: '1.5rem' }}>Add a New Title</h3>
          {!sectionsReady && <div style={{ marginBottom: '1rem', color: 'var(--warning)' }}>Sections are loading...</div>}
          <form className="grid-form" onSubmit={handleAddBook}>
            <div className="form-group">
              <label>Title</label>
              <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required />
            </div>
            <div className="form-group">
              <label>Author</label>
              <input type="text" value={author} onChange={(e) => setAuthor(e.target.value)} required />
            </div>
            <div className="grid-2col" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label>Version / Edition</label>
                <input type="text" value={version} onChange={(e) => setVersion(e.target.value)} required />
              </div>
              <div className="form-group">
                <label>Section</label>
                <select value={sectionId} onChange={(e) => setSectionId(e.target.value)} required>
                  <option value="">Select Section</option>
                  {sections.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
              </div>
            </div>
            <div className="grid-2col" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label>Cost (#)</label>
                <input type="number" step="0.01" value={cost} onChange={(e) => setCost(e.target.value)} required />
              </div>
              <div className="form-group">
                <label>Total Copies</label>
                <input type="number" min="1" value={totalCopies} onChange={(e) => setTotalCopies(e.target.value)} required />
              </div>
            </div>
            <button type="submit" style={{ marginTop: '1rem', width: '100%' }}>
              <PlusCircle size={20} /> Add to Collection
            </button>
          </form>
        </div>
      )}

      {activeTab === 'view' && (
        <div className="animate-fade">
          <div className="glass-card" style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '2rem' }}>
            <div className="form-group" style={{ flex: 1, marginBottom: 0 }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Layers size={16}/> Filter by Section</label>
              <select value={sectionFilter} onChange={(e) => setSectionFilter(e.target.value)}>
                <option value="ALL">ALL SECTIONS</option>
                {sections.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', paddingTop: '1.5rem' }}>
              <input 
                type="checkbox" 
                id="stock-check" 
                checked={includeOutOfStock} 
                onChange={(e) => setIncludeOutOfStock(e.target.checked)} 
                style={{ width: '18px', height: '18px' }}
              />
              <label htmlFor="stock-check" style={{ marginBottom: 0, cursor: 'pointer' }}>Include Out of Stock</label>
            </div>
            <button className="secondary" style={{ paddingTop: '0.75rem', marginTop: '1.5rem' }} onClick={fetchBooks}>
              <RefreshCw size={18} />
            </button>
          </div>

          <div className="glass-card">
            <div className="table-container">
              {loading ? (
                <div style={{ padding: '2rem', textAlign: 'center' }}>Syncing collection...</div>
              ) : books.length > 0 ? (
                <table>
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Title</th>
                      <th>Author</th>
                      <th>Version</th>
                      <th>Copies</th>
                      <th>Cost</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {books.map(book => (
                      <tr key={book.id}>
                        <td>#{book.id}</td>
                        <td style={{ fontWeight: 600 }}>{book.title}</td>
                        <td>{book.author}</td>
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
                  No books match your current filters.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'restock' && (
        <div className="glass-card animate-fade" style={{ maxWidth: '600px', margin: '0 auto' }}>
          <h3 style={{ marginBottom: '1.5rem' }}>Update Stock Levels</h3>
          <form onSubmit={handleRestock}>
            <div className="form-group">
              <label>Select Book</label>
              <select value={restockBookId} onChange={(e) => setRestockBookId(e.target.value)} required>
                <option value="">-- Choose Book --</option>
                {books.map(book => (
                  <option key={book.id} value={book.id}>#{book.id} - {book.title} ({book.version})</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Added Copies</label>
              <input type="number" min="1" value={addedCopies} onChange={(e) => setAddedCopies(e.target.value)} required />
            </div>
            <button type="submit" style={{ width: '100%', marginTop: '1rem' }}>
              <RefreshCw size={20} /> Update Stock Inventory
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
