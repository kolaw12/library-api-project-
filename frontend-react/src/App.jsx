import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  BookOpen, 
  Users, 
  ArrowLeftRight, 
  RotateCcw, 
  AlertCircle,
  Library,
  ChevronRight,
  Menu,
  X
} from 'lucide-react';

import Dashboard from './pages/Dashboard';
import Books from './pages/Books';
import Students from './pages/Students';
import Borrow from './pages/Borrow';
import Return from './pages/Return';
import Defaulters from './pages/Defaulters';
import SectionView from './pages/SectionView';
import api from './api';

const Sidebar = ({ sections, isOpen, toggle }) => {
  return (
    <div className={`sidebar ${isOpen ? 'open' : ''}`}>
      <div className="logo-section">
        <Library color="#7c4dff" size={32} />
        <h2>BiblioDesk</h2>
        <button 
          className="mobile-close" 
          onClick={toggle}
          style={{ display: 'none', background: 'transparent', padding: '0.25rem' }}
        >
          <X />
        </button>
      </div>
      
      <nav className="nav-links">
        <NavLink to="/" onClick={() => window.innerWidth < 1024 && toggle()} className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`} end>
          <LayoutDashboard /> Dashboard
        </NavLink>
        <NavLink to="/books" onClick={() => window.innerWidth < 1024 && toggle()} className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <BookOpen /> Books
        </NavLink>
        <NavLink to="/students" onClick={() => window.innerWidth < 1024 && toggle()} className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <Users /> Students
        </NavLink>
        <NavLink to="/borrow" onClick={() => window.innerWidth < 1024 && toggle()} className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <ArrowLeftRight /> Borrow
        </NavLink>
        <NavLink to="/return" onClick={() => window.innerWidth < 1024 && toggle()} className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <RotateCcw /> Return
        </NavLink>
        <NavLink to="/defaulters" onClick={() => window.innerWidth < 1024 && toggle()} className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <AlertCircle /> Defaulters
        </NavLink>

        <div style={{ margin: '1rem 0 0.5rem 1rem', fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600 }}>SECTIONS</div>
        {sections.map(section => (
          <NavLink 
            key={section.id} 
            to={`/sections/${section.id}`} 
            state={{ sectionName: section.name }}
            onClick={() => window.innerWidth < 1024 && toggle()}
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
          >
            <ChevronRight size={16} /> {section.name}
          </NavLink>
        ))}
      </nav>
    </div>
  );
};

const Header = () => {
  const location = useLocation();
  const getHeader = () => {
    const path = location.pathname;
    if (path === '/') return { title: 'Dashboard', subtitle: 'Overview of your library ecosystem' };
    if (path === '/books') return { title: 'Book Inventory', subtitle: 'Manage titles, stock, and collection' };
    if (path === '/students') return { title: 'Student Directory', subtitle: 'Manage student records and information' };
    if (path === '/borrow') return { title: 'Lend Books', subtitle: 'Issue books to registered students' };
    if (path === '/return') return { title: 'Return Books', subtitle: 'Process book returns and calculate fines' };
    if (path === '/defaulters') return { title: 'Outstanding Fines', subtitle: 'Track overdue borrowings and payments' };
    if (path.startsWith('/sections/')) return { title: 'Sectional Inventory', subtitle: 'Filtered view of collection categories' };
    return { title: 'Library Management', subtitle: 'Welcome back, Librarian' };
  };

  const { title, subtitle } = getHeader();

  return (
    <header className="page-header animate-fade">
      <h1 className="page-title">{title}</h1>
      <p className="page-subtitle">{subtitle}</p>
    </header>
  );
};

export default function App() {
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    api.get('/sections')
      .then(data => setSections(data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  if (loading) return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100vw', height: '100vh', background: 'var(--bg-color)', color: 'white' }}>Initializing BiblioDesk...</div>;

  return (
    <Router>
      <div className="app-container">
        <button 
          className="mobile-menu-toggle"
          onClick={toggleSidebar}
          style={{
            position: 'fixed',
            top: '1rem',
            left: '1rem',
            zIndex: 1100,
            padding: '0.75rem',
            borderRadius: '12px',
            background: 'var(--panel-bg)',
            backdropFilter: 'blur(10px)',
            border: '1px solid var(--panel-border)',
            display: 'none'
          }}
        >
          <Menu size={24} color="white" />
        </button>

        {sidebarOpen && (
          <div 
            className="sidebar-overlay"
            onClick={toggleSidebar}
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(0,0,0,0.5)',
              backdropFilter: 'blur(4px)',
              zIndex: 900
            }}
          />
        )}

        <Sidebar sections={sections} isOpen={sidebarOpen} toggle={toggleSidebar} />
        <main className="main-content">
          <Header />
          <div className="animate-fade">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/books" element={<Books sections={sections} />} />
              <Route path="/students" element={<Students />} />
              <Route path="/borrow" element={<Borrow />} />
              <Route path="/return" element={<Return />} />
              <Route path="/defaulters" element={<Defaulters />} />
              <Route path="/sections/:id" element={<SectionView />} />
            </Routes>
          </div>
        </main>
      </div>
    </Router>
  );
}
