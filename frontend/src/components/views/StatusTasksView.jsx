import TaskList from '../tasks/TaskList';

const statusLabels = {
  pending: 'Pending',
  'in-progress': 'In Progress',
  completed: 'Completed',
};

function StatusTasksView({ status, tasks, onDelete, onStatusChange }) {
  const label = statusLabels[status] || status;

  return (
    <div className="tasks-view">
      <div className="view-section">
        <h3 className="section-title">{label} Tasks</h3>
        <TaskList tasks={tasks} onDelete={onDelete} onStatusChange={onStatusChange} />
      </div>
    </div>
  );
}

export default StatusTasksView;
