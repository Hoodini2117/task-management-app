import { useState } from 'react';
import { FaPlus } from 'react-icons/fa';

function QuickCreate({ onTaskCreated }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('pending');
  const [priority, setPriority] = useState('medium');
  const [dueDate, setDueDate] = useState('');
  const [dueTime, setDueTime] = useState('');
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
        description: description || '',
        status,
        priority,
        due_date: dueDate || null,
        due_time: dueTime || null,
      });
      setTitle('');
      setDescription('');
      setStatus('pending');
      setPriority('medium');
      setDueDate('');
      setDueTime('');
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
      <input
        type="text"
        className="quick-create-input"
        placeholder="Description (optional)"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <div className="quick-create-row">
        <input
          type="date"
          className="quick-create-date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          title="Due date"
        />
        <input
          type="time"
          className="quick-create-time"
          value={dueTime}
          onChange={(e) => setDueTime(e.target.value)}
          title="Due time"
        />
      </div>
      <div className="quick-create-row">
        <select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="pending">Pending</option>
          <option value="in-progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>
        <select value={priority} onChange={(e) => setPriority(e.target.value)}>
          <option value="low">🟢 Low</option>
          <option value="medium">🟡 Medium</option>
          <option value="high">🔴 High</option>
        </select>
        <button type="submit" title="Add task">
          <FaPlus style={{ marginRight: 6 }} />
          Create
        </button>
      </div>
      {error && <p className="form-error">{error}</p>}
    </form>
  );
}

export default QuickCreate;
