import { FaTrash } from 'react-icons/fa';

function TaskCard({ task, onDelete }) {
  const statusClass = `status-badge status-${task.status}`;
  const createdDate = new Date(task.created_at).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <div className="task-card">
      <div className="task-card-header">
        <h3>{task.title}</h3>
        <span className={statusClass}>{task.status}</span>
      </div>

      {task.description && (
        <p className="task-description">{task.description}</p>
      )}

      <div className="task-card-footer">
        <span className="task-date">{createdDate}</span>
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
