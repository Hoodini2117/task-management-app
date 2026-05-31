import { useState } from 'react';

const initialState = {
  title: '',
  description: '',
  status: 'pending',
  priority: 'medium',
  due_date: '',
  due_time: '',
};

function TaskForm({ onTaskCreated }) {
  const [form, setForm] = useState(initialState);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!form.title.trim()) {
      setError('Title is required');
      return;
    }

    try {
      await onTaskCreated({
        ...form,
        due_date: form.due_date || null,
        due_time: form.due_time || null,
      });
      setForm(initialState);
    } catch (err) {
      setError('Failed to create task');
    }
  };

  return (
    <form className="task-form" onSubmit={handleSubmit}>
      <h2>New Task</h2>

      {error && <p className="form-error">{error}</p>}

      <input
        type="text"
        name="title"
        placeholder="Task title"
        value={form.title}
        onChange={handleChange}
      />

      <textarea
        name="description"
        placeholder="Description (optional)"
        value={form.description}
        onChange={handleChange}
        rows={2}
      />

      <div className="form-row">
        <input
          type="date"
          name="due_date"
          value={form.due_date}
          onChange={handleChange}
          title="Due date"
        />
        <input
          type="time"
          name="due_time"
          value={form.due_time}
          onChange={handleChange}
          title="Due time"
        />
      </div>

      <div className="form-row">
        <select name="status" value={form.status} onChange={handleChange}>
          <option value="pending">Pending</option>
          <option value="in-progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>
        <select name="priority" value={form.priority} onChange={handleChange}>
          <option value="low">🟢 Low</option>
          <option value="medium">🟡 Medium</option>
          <option value="high">🔴 High</option>
        </select>
        <button type="submit">Create Task</button>
      </div>
    </form>
  );
}

export default TaskForm;
