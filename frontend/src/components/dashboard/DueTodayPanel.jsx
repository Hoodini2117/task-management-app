import { getPriorityLabel } from '../../utils/taskUtils';
import { isOverdue } from '../../utils/dateUtils';
import { FaCalendarDay } from 'react-icons/fa';

function DueTodayPanel({ tasks }) {
  return (
    <div className="dashboard-panel">
      <div className="panel-header">
        <h3 className="panel-title">
          <FaCalendarDay style={{ marginRight: 6 }} />
          Due Today
        </h3>
        <span className="panel-count">{tasks.length}</span>
      </div>

      {tasks.length === 0 ? (
        <p className="panel-empty">No tasks due today</p>
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
                {isOverdue(task) && (
                  <span className="mini-badge badge-overdue">Overdue</span>
                )}
                {task.due_time && (
                  <span className="panel-item-time">{task.due_time}</span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default DueTodayPanel;
