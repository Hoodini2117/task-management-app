import { FaTasks, FaClock, FaSpinner, FaCheckCircle, FaArchive } from 'react-icons/fa';

function StatsCards({ tasks }) {
  const total = tasks.length;
  const pending = tasks.filter((t) => t.status === 'pending').length;
  const inProgress = tasks.filter((t) => t.status === 'in-progress').length;
  const completed = tasks.filter((t) => t.status === 'completed').length;
  const archived = tasks.filter((t) => t.is_archived).length;

  const cards = [
    { label: 'Total Tasks', count: total, icon: <FaTasks />, colorClass: 'stat-primary' },
    { label: 'Pending', count: pending, icon: <FaClock />, colorClass: 'stat-warning' },
    { label: 'In Progress', count: inProgress, icon: <FaSpinner />, colorClass: 'stat-info' },
    { label: 'Completed', count: completed, icon: <FaCheckCircle />, colorClass: 'stat-success' },
    { label: 'Archived', count: archived, icon: <FaArchive />, colorClass: 'stat-purple' },
  ];

  return (
    <div className="stats-grid">
      {cards.map((card) => (
        <div className={`stat-card ${card.colorClass}`} key={card.label}>
          <div className="stat-card-icon">
            {card.icon}
          </div>
          <div className="stat-card-info">
            <span className="stat-card-count">{card.count}</span>
            <span className="stat-card-label">{card.label}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

export default StatsCards;
