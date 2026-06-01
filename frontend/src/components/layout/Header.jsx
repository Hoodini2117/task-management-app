import { FaBars, FaPlus } from 'react-icons/fa';

const viewTitles = {
  dashboard: 'Dashboard',
  all: 'All Tasks',
  pending: 'Pending Tasks',
  'in-progress': 'In Progress',
  completed: 'Completed Tasks',
  history: 'Task History',
};

const viewSubtitles = {
  dashboard: 'Overview of your productivity',
  all: 'Manage all your tasks',
  pending: 'Tasks waiting to be started',
  'in-progress': 'Tasks currently in progress',
  completed: 'Tasks you\'ve finished',
  history: 'Complete task history log',
};

function Header({ tasks, activeView, onToggleSidebar, onNewTask }) {
  const title = viewTitles[activeView] || 'Dashboard';
  const subtitle = viewSubtitles[activeView] || '';

  return (
    <header className="dashboard-header">
      <div className="header-top">
        <div className="header-left">
          <button className="mobile-toggle" onClick={onToggleSidebar}>
            <FaBars />
          </button>
          <div className="header-titles">
            <h2 className="header-title">{title}</h2>
            <p className="header-subtitle">{subtitle}</p>
          </div>
        </div>
        <div className="header-right">
          <button className="btn-new-task" onClick={onNewTask}>
            <FaPlus />
            <span>New Task</span>
          </button>
        </div>
      </div>
    </header>
  );
}

export default Header;
