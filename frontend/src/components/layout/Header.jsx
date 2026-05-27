import { FaBars } from 'react-icons/fa';

function Header({ tasks, onToggleSidebar }) {
  const pending = tasks.filter((t) => t.status === 'pending').length;
  const inProgress = tasks.filter((t) => t.status === 'in-progress').length;
  const completed = tasks.filter((t) => t.status === 'completed').length;

  return (
    <header className="dashboard-header">
      <div className="header-top">
        <div>
          <button className="mobile-toggle" onClick={onToggleSidebar}>
            <FaBars />
          </button>
          <p className="header-greeting">Welcome back</p>
          <h2 className="header-title">Task Dashboard</h2>
        </div>
      </div>

      <div className="header-stats">
        <div className="stat-item">
          <span className="stat-dot pending" />
          {pending} Pending
        </div>
        <div className="stat-item">
          <span className="stat-dot in-progress" />
          {inProgress} In Progress
        </div>
        <div className="stat-item">
          <span className="stat-dot completed" />
          {completed} Completed
        </div>
      </div>
    </header>
  );
}

export default Header;
