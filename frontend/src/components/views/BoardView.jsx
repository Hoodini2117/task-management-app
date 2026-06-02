import TaskCard from '../tasks/TaskCard';
import { FaClock, FaSpinner, FaCheckCircle } from 'react-icons/fa';

const columns = [
  { key: 'pending', label: 'Pending', icon: <FaClock />, colorClass: 'board-col-warning' },
  { key: 'in-progress', label: 'In Progress', icon: <FaSpinner />, colorClass: 'board-col-info' },
  { key: 'completed', label: 'Completed', icon: <FaCheckCircle />, colorClass: 'board-col-success' },
];

function BoardView({ tasks, onDelete, onStatusChange, onTaskClick }) {
  const getColumnTasks = (status) =>
    tasks.filter((t) => t.status === status && !t.is_archived);

  return (
    <div className="board-view">
      <div className="kanban-board">
        {columns.map((col) => {
          const columnTasks = getColumnTasks(col.key);
          return (
            <div key={col.key} className={`kanban-column ${col.colorClass}`}>
              <div className="kanban-header">
                <div className="kanban-header-left">
                  <span className="kanban-icon">{col.icon}</span>
                  <h3>{col.label}</h3>
                </div>
                <span className="kanban-count">{columnTasks.length}</span>
              </div>
              <div className="kanban-cards">
                {columnTasks.length === 0 ? (
                  <p className="kanban-empty">No tasks</p>
                ) : (
                  columnTasks.map((task) => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      onDelete={onDelete}
                      onStatusChange={onStatusChange}
                      onTaskClick={onTaskClick}
                      compact
                    />
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default BoardView;
