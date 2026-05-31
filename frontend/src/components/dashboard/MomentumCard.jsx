import { FaRocket } from 'react-icons/fa';

function MomentumCard({ count }) {
  return (
    <div className="dashboard-panel momentum-card">
      <div className="momentum-icon">
        <FaRocket />
      </div>
      <div className="momentum-info">
        <span className="momentum-count">{count}</span>
        <span className="momentum-label">
          Task{count !== 1 ? 's' : ''} Completed Today
        </span>
      </div>
    </div>
  );
}

export default MomentumCard;
