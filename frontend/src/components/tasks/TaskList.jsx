import TaskCard from './TaskCard';

function TaskList({ tasks, onDelete, onStatusChange, onTaskClick }) {
  if (tasks.length === 0) {
    return <p className="empty-state">No tasks yet. Create one above!</p>;
  }

  return (
    <div className="task-list">
      {tasks.map((task) => (
        <TaskCard
          key={task.id}
          task={task}
          onDelete={onDelete}
          onStatusChange={onStatusChange}
          onTaskClick={onTaskClick}
        />
      ))}
    </div>
  );
}

export default TaskList;
