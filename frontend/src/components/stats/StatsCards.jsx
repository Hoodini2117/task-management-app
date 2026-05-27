import { FaTasks, FaClock, FaSpinner, FaCheckCircle } from 'react-icons/fa';

function StatsCards({ tasks }) {
  const total = tasks.length;
  const pending = tasks.filter((t) => t.status === 'pending').length;
  const inProgress = tasks.filter((t) => t.status === 'in-progress').length;
  const completed = tasks.filter((t) => t.status === 'completed').length;

  const cards = [
    { label: 'Total Tasks', count: total, icon: <FaTasks />, color: '#7c6cfc' },
    { label: 'Pending', count: pending, icon: <FaClock />, color: '#f0ad4e' },
    { label: 'In Progress', count: inProgress, icon: <FaSpinner />, color: '#5b9df0' },
    { label: 'Completed', count: completed, icon: <FaCheckCircle />, color: '#51c98e' },
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
