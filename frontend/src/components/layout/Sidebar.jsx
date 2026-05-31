import { FaTasks, FaCheckCircle, FaClock, FaSpinner, FaHistory } from 'react-icons/fa';
import { MdDashboard } from 'react-icons/md';

const navItems = [
  { label: 'Dashboard', icon: <MdDashboard />, view: 'dashboard' },
  { label: 'All Tasks', icon: <FaTasks />, view: 'all' },
  { label: 'Pending', icon: <FaClock />, view: 'pending' },
  { label: 'In Progress', icon: <FaSpinner />, view: 'in-progress' },
  { label: 'Completed', icon: <FaCheckCircle />, view: 'completed' },
  { label: 'History', icon: <FaHistory />, view: 'history' },
];

function Sidebar({ sidebarOpen, onClose, activeView, onViewChange }) {
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

        <ul className="sidebar-nav">
          {navItems.map((item) => (
            <li key={item.label}>
              <button
                className={`nav-link ${activeView === item.view ? 'active' : ''}`}
                onClick={() => handleClick(item.view)}
              >
                <span className="nav-icon">{item.icon}</span>
                {item.label}
              </button>
            </li>
          ))}
        </ul>

        <div className="sidebar-footer">
          <p>Task Manager v2.0</p>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;
