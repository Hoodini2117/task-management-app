import TaskCard from './TaskCard';

function TaskList({ tasks, onDelete }) {
  if (tasks.length === 0) {
    return <p className="empty-state">No tasks yet. Create one above!</p>;
  }

  return (
    <div className="task-list">
      {tasks.map((task) => (
        <TaskCard key={task.id} task={task} onDelete={onDelete} />
      ))}
    </div>
  );
}

export default TaskList;
