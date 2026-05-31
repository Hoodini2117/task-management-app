import { getPriorityLabel } from '../../utils/taskUtils';
import { formatShortDate } from '../../utils/dateUtils';
import { FaClock } from 'react-icons/fa';

function UpcomingDeadlines({ tasks }) {
  return (
    <div className="dashboard-panel">
      <div className="panel-header">
        <h3 className="panel-title">
          <FaClock style={{ marginRight: 6 }} />
          Upcoming Deadlines
        </h3>
        <span className="panel-count">{tasks.length}</span>
      </div>

      {tasks.length === 0 ? (
        <p className="panel-empty">No upcoming deadlines</p>
      ) : (
        <div className="panel-list">
          {tasks.map((task) => (
            <div key={task.id} className="panel-item">
              <div className="panel-item-top">
                <span className="panel-item-title">{task.title}</span>
                <span className={`mini-badge priority-${task.priority}`}>
                  {getPriorityLabel(task.priority)}
                </span>
              </div>
              <div className="panel-item-meta">
                <span className="panel-item-time">
                  {formatShortDate(task.due_date)}
                  {task.due_time ? ` · ${task.due_time}` : ''}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default UpcomingDeadlines;
