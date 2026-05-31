import { FaTrash } from 'react-icons/fa';
import { isOverdue, isDueToday } from '../../utils/dateUtils';
import { getPriorityLabel } from '../../utils/taskUtils';

function getTaskBadges(task) {
  const badges = [];

  if (task.priority && task.priority !== 'medium') {
    const cls = task.priority === 'high' ? 'badge-priority-high' : 'badge-priority-low';
    badges.push({ label: getPriorityLabel(task.priority), className: cls });
  } else if (task.priority === 'medium') {
    badges.push({ label: getPriorityLabel('medium'), className: 'badge-priority-medium' });
  }

  if (task.status === 'completed') {
    badges.push({ label: '✓ Completed', className: 'badge-completed' });
  } else if (task.due_date) {
    if (isDueToday(task)) {
      badges.push({ label: '⏰ Due Today', className: 'badge-due-today' });
    } else if (isOverdue(task)) {
      badges.push({ label: '⚠ Overdue', className: 'badge-overdue' });
    }
  }

  if (task.is_archived) {
    badges.push({ label: '📦 Archived', className: 'badge-archived' });
  }

  return badges;
}

function formatDueDate(task) {
  if (!task.due_date) return null;
  const d = new Date(task.due_date + 'T00:00:00');
  const label = d.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });
  const time = task.due_time || '';
  return `Due: ${label}${time ? ' · ' + time : ''}`;
}

function TaskCard({ task, onDelete, onStatusChange }) {
  const createdDate = new Date(task.created_at).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  const badges = getTaskBadges(task);
  const dueLabel = formatDueDate(task);

  return (
    <div className={`task-card${task.is_archived ? ' task-card-archived' : ''}`}>
      <div className="task-card-header">
        <h3>{task.title}</h3>
        <select
          className={`status-select status-${task.status}`}
          value={task.status}
          onChange={(e) => onStatusChange(task.id, e.target.value)}
        >
          <option value="pending">Pending</option>
          <option value="in-progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>
      </div>

      {task.description && (
        <p className="task-description">{task.description}</p>
      )}

      {badges.length > 0 && (
        <div className="task-badges">
          {badges.map((b) => (
            <span key={b.label} className={`task-badge ${b.className}`}>
              {b.label}
            </span>
          ))}
        </div>
      )}

      <div className="task-card-footer">
        <div className="task-meta">
          <span className="task-date">{createdDate}</span>
          {dueLabel && <span className="task-due">{dueLabel}</span>}
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
