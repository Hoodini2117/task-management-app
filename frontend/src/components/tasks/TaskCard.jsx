import { FaTrash, FaCalendarAlt, FaClock } from 'react-icons/fa';
import { isOverdue, isDueToday } from '../../utils/dateUtils';

const priorityConfig = {
  high: { label: 'High', className: 'priority-high' },
  medium: { label: 'Medium', className: 'priority-medium' },
  low: { label: 'Low', className: 'priority-low' },
};

const statusConfig = {
  pending: { label: 'Pending', className: 'status-pending' },
  'in-progress': { label: 'In Progress', className: 'status-in-progress' },
  completed: { label: 'Completed', className: 'status-completed' },
};

function formatDueDate(task) {
  if (!task.due_date) return null;
  const d = new Date(task.due_date + 'T00:00:00');
  const label = d.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });
  const time = task.due_time || '';
  return `${label}${time ? ' · ' + time : ''}`;
}

function TaskCard({ task, onDelete, onStatusChange, compact }) {
  const createdDate = new Date(task.created_at).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  const dueLabel = formatDueDate(task);
  const overdue = isOverdue(task);
  const dueToday = isDueToday(task);
  const priority = priorityConfig[task.priority] || priorityConfig.medium;

  return (
    <div className={`task-card${task.is_archived ? ' task-card-archived' : ''}${compact ? ' task-card-compact' : ''}`}>
      <div className="task-card-header">
        <div className="task-card-title-row">
          <h3 className="task-card-title">{task.title}</h3>
          {overdue && <span className="urgency-dot urgency-overdue" title="Overdue" />}
          {dueToday && !overdue && <span className="urgency-dot urgency-today" title="Due today" />}
        </div>
        <select
          className={`status-select ${statusConfig[task.status]?.className || ''}`}
          value={task.status}
          onChange={(e) => onStatusChange(task.id, e.target.value)}
        >
          <option value="pending">Pending</option>
          <option value="in-progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>
      </div>

      {task.description && !compact && (
        <p className="task-description">{task.description}</p>
      )}

      <div className="task-badges">
        <span className={`pill ${priority.className}`}>{priority.label}</span>
        {task.is_archived && (
          <span className="pill pill-archived">Archived</span>
        )}
        {overdue && (
          <span className="pill pill-overdue">Overdue</span>
        )}
        {dueToday && !overdue && (
          <span className="pill pill-due-today">Due Today</span>
        )}
      </div>

      <div className="task-card-footer">
        <div className="task-meta">
          {!compact && <span className="task-date">{createdDate}</span>}
          {dueLabel && (
            <span className="task-due">
              <FaCalendarAlt className="task-due-icon" />
              {dueLabel}
            </span>
          )}
        </div>
        <button
          className="delete-btn"
          onClick={() => onDelete(task.id)}
          title="Delete task"
        >
          <FaTrash />
        </button>
      </div>
    </div>
  );
}

export default TaskCard;
