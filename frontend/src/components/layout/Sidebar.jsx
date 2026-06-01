import {
  FaTasks, FaCheckCircle, FaClock, FaSpinner, FaHistory, FaSun, FaMoon,
} from 'react-icons/fa';
import { MdDashboard } from 'react-icons/md';
import { useTheme } from '../ui/ThemeProvider';

const navItems = [
  { label: 'Dashboard', icon: <MdDashboard />, view: 'dashboard' },
  { label: 'All Tasks', icon: <FaTasks />, view: 'all' },
  { label: 'Pending', icon: <FaClock />, view: 'pending', countKey: 'pending' },
  { label: 'In Progress', icon: <FaSpinner />, view: 'in-progress', countKey: 'in-progress' },
  { label: 'Completed', icon: <FaCheckCircle />, view: 'completed', countKey: 'completed' },
  { label: 'History', icon: <FaHistory />, view: 'history' },
];

function Sidebar({ sidebarOpen, onClose, activeView, onViewChange, tasks = [] }) {
  const { theme, toggleTheme } = useTheme();

  const counts = {
    'pending': tasks.filter((t) => t.status === 'pending').length,
    'in-progress': tasks.filter((t) => t.status === 'in-progress').length,
    'completed': tasks.filter((t) => t.status === 'completed').length,
  };

  const handleClick = (view) => {
    onViewChange(view);
    onClose();
  };

  return (
    <>
      {sidebarOpen && <div className="sidebar-overlay" onClick={onClose} />}
      <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-brand">
          <div className="brand-icon">
            <FaTasks />
          </div>
          <h1>Taskly</h1>
        </div>

        <nav className="sidebar-nav-section">
          <span className="nav-section-label">Menu</span>
          <ul className="sidebar-nav">
            {navItems.map((item) => (
              <li key={item.label}>
                <button
                  className={`nav-link ${activeView === item.view ? 'active' : ''}`}
                  onClick={() => handleClick(item.view)}
                >
                  <span className="nav-icon">{item.icon}</span>
                  <span className="nav-label">{item.label}</span>
                  {item.countKey && counts[item.countKey] > 0 && (
                    <span className="nav-badge">{counts[item.countKey]}</span>
                  )}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        <div className="sidebar-footer">
          <button className="theme-toggle" onClick={toggleTheme} title="Toggle theme">
            {theme === 'light' ? <FaMoon /> : <FaSun />}
            <span>{theme === 'light' ? 'Dark Mode' : 'Light Mode'}</span>
          </button>
          <p className="sidebar-version">Taskly v2.0</p>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;
