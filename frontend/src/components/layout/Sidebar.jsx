import { FaTasks, FaCheckCircle, FaClock } from 'react-icons/fa';
import { MdDashboard } from 'react-icons/md';

const navItems = [
  { label: 'Dashboard', icon: <MdDashboard />, filter: null },
  { label: 'All Tasks', icon: <FaTasks />, filter: null },
  { label: 'Pending', icon: <FaClock />, filter: 'pending' },
  { label: 'Completed', icon: <FaCheckCircle />, filter: 'completed' },
];

function Sidebar({ sidebarOpen, onClose, activeFilter, onFilterChange }) {
  const handleClick = (filter) => {
    onFilterChange(filter);
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
                className={`nav-link ${activeFilter === item.filter ? 'active' : ''}`}
                onClick={() => handleClick(item.filter)}
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
