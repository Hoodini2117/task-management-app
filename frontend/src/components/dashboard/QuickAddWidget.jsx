import { useState } from 'react';
import { FaPlus } from 'react-icons/fa';

function QuickAddWidget({ onTaskCreated }) {
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
        priority,
        due_date: dueDate || null,
      });
      setTitle('');
      setPriority('medium');
      setDueDate('');
    } catch (err) {
      setError('Failed to create task');
    }
  };

  return (
    <div className="dashboard-panel">
      <h3 className="panel-title">Quick Add</h3>
      <form className="quick-add-form" onSubmit={handleSubmit}>
        <input
          type="text"
          className="quick-add-input"
          placeholder="Task title..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <div className="quick-add-row">
          <select
            className="quick-add-select"
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
          >
            <option value="low">🟢 Low</option>
            <option value="medium">🟡 Medium</option>
            <option value="high">🔴 High</option>
          </select>
          <input
            type="date"
            className="quick-add-date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
          />
          <button type="submit" className="quick-add-btn">
            <FaPlus style={{ marginRight: 4 }} />
            Add
          </button>
        </div>
        {error && <p className="form-error">{error}</p>}
      </form>
    </div>
  );
}

export default QuickAddWidget;
