import { useState, useEffect } from 'react';
import api from '../api';
import { UserPlus, AtSign, Briefcase, GraduationCap, Search } from 'lucide-react';

export default function Students() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fullName, setFullName] = useState('');
  const [matricNumber, setMatricNumber] = useState('');
  const [email, setEmail] = useState('');
  const [department, setDepartment] = useState('');

  const fetchStudents = () => {
    setLoading(true);
    api.get('/students')
      .then(data => setStudents(data))
      .catch(err => alert(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const handleAddStudent = (e) => {
    e.preventDefault();
    const payload = {
      full_name: fullName,
      matric_number: matricNumber,
      email: email,
      department: department || null,
    };

    api.post('/students', payload)
      .then(() => {
        alert('Student registered successfully!');
        setFullName('');
        setMatricNumber('');
        setEmail('');
        setDepartment('');
        fetchStudents();
      })
      .catch(err => alert(err));
  };

  return (
    <div className="animate-fade" style={{ display: 'grid', gridTemplateColumns: 'minmax(350px, 400px) 1fr', gap: '2.5rem' }}>
      <div className="glass-card">
        <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}><UserPlus size={20} color="var(--accent)"/> Add New Student</h3>
        <form onSubmit={handleAddStudent}>
          <div className="form-group">
            <label>Full Name</label>
            <div style={{ position: 'relative' }}>
              <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} required />
              <GraduationCap style={{ position: 'absolute', right: '12px', top: '12px', opacity: 0.3 }} size={18} />
            </div>
          </div>
          <div className="form-group">
            <label>Matric Number</label>
            <div style={{ position: 'relative' }}>
              <input type="text" value={matricNumber} onChange={(e) => setMatricNumber(e.target.value)} required />
              <AtSign style={{ position: 'absolute', right: '12px', top: '12px', opacity: 0.3 }} size={18} />
            </div>
          </div>
          <div className="form-group">
            <label>Email Address</label>
            <div style={{ position: 'relative' }}>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
          </div>
          <div className="form-group">
            <label>Department (Optional)</label>
            <div style={{ position: 'relative' }}>
              <input type="text" value={department} onChange={(e) => setDepartment(e.target.value)} />
              <Briefcase style={{ position: 'absolute', right: '12px', top: '12px', opacity: 0.3 }} size={18} />
            </div>
          </div>
          <button type="submit" style={{ width: '100%', marginTop: '1rem' }}>
            Register Student
          </button>
        </form>
      </div>

      <div className="glass-card">
        <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}><Search size={20} color="var(--accent)"/> Directory</h3>
        <div className="table-container">
          {loading ? (
            <div style={{ padding: '2rem', textAlign: 'center' }}>Syncing student records...</div>
          ) : students.length > 0 ? (
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Matric #</th>
                  <th>Email</th>
                  <th>Department</th>
                </tr>
              </thead>
              <tbody>
                {students.map(student => (
                  <tr key={student.id}>
                    <td>#{student.id}</td>
                    <td style={{ fontWeight: 600 }}>{student.full_name}</td>
                    <td>{student.matric_number}</td>
                    <td style={{ fontSize: '0.85rem' }}>{student.email}</td>
                    <td>{student.department || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
              No students found in the directory.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
