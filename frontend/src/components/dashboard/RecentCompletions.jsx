import { formatDateTime } from '../../utils/dateUtils';
import { FaCheckCircle } from 'react-icons/fa';

function RecentCompletions({ tasks }) {
  return (
    <div className="dashboard-panel">
      <div className="panel-header">
        <h3 className="panel-title">
          <FaCheckCircle style={{ marginRight: 6 }} />
          Recent Completions
        </h3>
        <span className="panel-count">{tasks.length}</span>
      </div>

      {tasks.length === 0 ? (
        <p className="panel-empty">No completed tasks yet</p>
      ) : (
        <div className="panel-list">
          {tasks.map((task) => (
            <div key={task.id} className="panel-item">
              <div className="panel-item-top">
                <span className="panel-item-title panel-item-done">{task.title}</span>
              </div>
              <div className="panel-item-meta">
                <span className="panel-item-time">
                  Completed: {formatDateTime(task.completed_at)}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default RecentCompletions;
