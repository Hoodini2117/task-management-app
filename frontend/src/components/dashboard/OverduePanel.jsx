import { getPriorityLabel } from '../../utils/taskUtils';
import { formatShortDate } from '../../utils/dateUtils';
import { FaExclamationTriangle } from 'react-icons/fa';

function OverduePanel({ tasks }) {
  return (
    <div className="dashboard-panel panel-overdue">
      <div className="panel-header">
        <h3 className="panel-title">
          <FaExclamationTriangle style={{ marginRight: 6 }} />
          Overdue
        </h3>
        <span className="panel-count panel-count-warn">{tasks.length}</span>
      </div>

      {tasks.length === 0 ? (
        <p className="panel-empty">No overdue tasks 🎉</p>
      ) : (
        <div className="panel-list">
          {tasks.map((task) => (
            <div key={task.id} className="panel-item panel-item-overdue">
              <div className="panel-item-top">
                <span className="panel-item-title">{task.title}</span>
                <span className={`mini-badge priority-${task.priority}`}>
                  {getPriorityLabel(task.priority)}
                </span>
              </div>
              {task.description && (
                <p className="panel-item-desc">
                  {task.description.length > 60
                    ? task.description.slice(0, 60) + '…'
                    : task.description}
                </p>
              )}
              <div className="panel-item-meta">
                <span className={`mini-badge status-${task.status}`}>
                  {task.status === 'in-progress' ? 'In Progress' : task.status.charAt(0).toUpperCase() + task.status.slice(1)}
                </span>
                <span className="panel-item-time">
                  Due: {formatShortDate(task.due_date)}
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

export default OverduePanel;
