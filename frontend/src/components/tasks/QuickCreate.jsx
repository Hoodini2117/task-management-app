import { useState } from 'react';
import { FaPlus } from 'react-icons/fa';

function QuickCreate({ onTaskCreated }) {
  const [title, setTitle] = useState('');
  const [priority, setPriority] = useState('medium');
  const [dueDate, setDueDate] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!title.trim()) {
      setError('Title is required');
      return;
    }

    try {
      await onTaskCreated({
        title,
        description: '',
        status: 'pending',
        priority,
        due_date: dueDate || null,
        due_time: null,
      });
      setTitle('');
      setPriority('medium');
      setDueDate('');
    } catch (err) {
      setError('Failed to create task');
    }
  };

  return (
    <form className="quick-create" onSubmit={handleSubmit}>
      <input
        type="text"
        className="quick-create-input"
        placeholder="Task title..."
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <div className="quick-create-row">
        <select value={priority} onChange={(e) => setPriority(e.target.value)}>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
        <input
          type="date"
          className="quick-create-date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          title="Due date"
        />
        <button type="submit" title="Add task">
          <FaPlus style={{ marginRight: 6 }} />
          Add Task
        </button>
      </div>
      {error && <p className="form-error">{error}</p>}
    </form>
  );
}

export default QuickCreate;
