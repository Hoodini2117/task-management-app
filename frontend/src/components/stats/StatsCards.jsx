import { FaTasks, FaClock, FaSpinner, FaCheckCircle, FaArchive, FaExclamationTriangle } from 'react-icons/fa';
import { isOverdue } from '../../utils/dateUtils';

function StatsCards({ tasks }) {
  const total = tasks.length;
  const pending = tasks.filter((t) => t.status === 'pending').length;
  const inProgress = tasks.filter((t) => t.status === 'in-progress').length;
  const completed = tasks.filter((t) => t.status === 'completed').length;
  const archived = tasks.filter((t) => t.is_archived).length;
  const overdue = tasks.filter(isOverdue).length;

  const cards = [
    { label: 'Total Tasks', count: total, icon: <FaTasks />, color: '#7c6cfc' },
    { label: 'Pending', count: pending, icon: <FaClock />, color: '#f0ad4e' },
    { label: 'In Progress', count: inProgress, icon: <FaSpinner />, color: '#5b9df0' },
    { label: 'Completed', count: completed, icon: <FaCheckCircle />, color: '#51c98e' },
    { label: 'Overdue', count: overdue, icon: <FaExclamationTriangle />, color: '#e67e22' },
    { label: 'Archived', count: archived, icon: <FaArchive />, color: '#9b7fdb' },
  ];

  return (
    <div className="stats-grid">
      {cards.map((card) => (
        <div className="stat-card" key={card.label}>
          <div className="stat-card-icon" style={{ background: `${card.color}15`, color: card.color }}>
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
