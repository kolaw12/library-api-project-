import { useState, useEffect } from 'react';
import api from '../api';
import { BookOpen, UserCheck, CalendarDays, ArrowRightCircle } from 'lucide-react';

export default function Borrow() {
  const [students, setStudents] = useState([]);
  const [books, setBooks] = useState([]);
  const [borrows, setBorrows] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form states
  const [studentId, setStudentId] = useState('');
  const [bookId, setBookId] = useState('');
  const [lendDays, setLendDays] = useState(7);

  const fetchData = () => {
    setLoading(true);
    Promise.all([
      api.get('/students'),
      api.get('/books', { params: { include_out_of_stock: false } }),
      api.get('/borrows', { params: { only_active: true } })
    ]).then(([studentData, bookData, borrowData]) => {
      setStudents(studentData);
      setBooks(bookData);
      setBorrows(borrowData);
    }).catch(err => alert(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleBorrow = (e) => {
    e.preventDefault();
    if (!studentId || !bookId) return alert('Select both student and book!');

    const payload = {
      student_id: parseInt(studentId),
      book_id: parseInt(bookId),
      lend_days: parseInt(lendDays),
    };

    api.post('/borrow', payload)
      .then((data) => {
        alert(`Book borrowed successfully!\nDue date: ${new Date(data.due_at).toLocaleDateString()}`);
        setStudentId('');
        setBookId('');
        setLendDays(7);
        fetchData();
      })
      .catch(err => alert(err));
  };

  return (
    <div className="animate-fade" style={{ display: 'grid', gridTemplateColumns: 'minmax(400px, 450px) 1fr', gap: '2.5rem' }}>
      <div className="glass-card">
        <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}><ArrowRightCircle size={20} color="var(--accent)"/> Lend a Title</h3>
        
        {loading ? (
          <div>Preparing registry...</div>
        ) : students.length === 0 ? (
          <div className="badge badge-danger" style={{ display: 'block', padding: '1rem', textAlign: 'center' }}>Wait! You must add students first.</div>
        ) : books.length === 0 ? (
          <div className="badge badge-warning" style={{ display: 'block', padding: '1rem', textAlign: 'center' }}>No available books in stock.</div>
        ) : (
          <form onSubmit={handleBorrow}>
            <div className="form-group">
              <label>Lend To Student</label>
              <div style={{ position: 'relative' }}>
                <select value={studentId} onChange={(e) => setStudentId(e.target.value)} required>
                  <option value="">-- Select Student --</option>
                  {students.map(s => <option key={s.id} value={s.id}>#{s.id} - {s.full_name} ({s.matric_number})</option>)}
                </select>
                <UserCheck style={{ position: 'absolute', right: '12px', top: '12px', opacity: 0.3 }} size={18} />
              </div>
            </div>
            
            <div className="form-group">
              <label>Book to Borrow</label>
              <div style={{ position: 'relative' }}>
                <select value={bookId} onChange={(e) => setBookId(e.target.value)} required>
                  <option value="">-- Choose Available Book --</option>
                  {books.map(b => (
                    <option key={b.id} value={b.id}>
                      #{b.id} - {b.title} [{b.section_name}] ({b.available_copies} left)
                    </option>
                  ))}
                </select>
                <BookOpen style={{ position: 'absolute', right: '12px', top: '12px', opacity: 0.3 }} size={18} />
              </div>
            </div>

            <div className="form-group">
              <label>Lend Duration (Days)</label>
              <div style={{ position: 'relative' }}>
                <input type="number" min="1" max="30" value={lendDays} onChange={(e) => setLendDays(e.target.value)} required />
                <CalendarDays style={{ position: 'absolute', right: '12px', top: '12px', opacity: 0.3 }} size={18} />
              </div>
            </div>

            <button type="submit" style={{ width: '100%', marginTop: '1rem' }}>
              Confirm Transaction
            </button>
          </form>
        )}
      </div>

      <div className="glass-card">
        <h3 style={{ marginBottom: '1.5rem' }}>Active Loans</h3>
        <div className="table-container">
          {borrows.length > 0 ? (
            <table>
              <thead>
                <tr>
                  <th>Student</th>
                  <th>Book</th>
                  <th>Due Date</th>
                </tr>
              </thead>
              <tbody>
                {borrows.map(borrow => (
                  <tr key={borrow.id}>
                    <td style={{ fontWeight: 600 }}>{borrow.student_name}</td>
                    <td>{borrow.book_title}</td>
                    <td>
                      <span className={`badge ${borrow.status === 'OVERDUE' ? 'badge-danger' : 'badge-warning'}`}>
                        {new Date(borrow.due_at).toLocaleDateString()}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
              No active loans found.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
