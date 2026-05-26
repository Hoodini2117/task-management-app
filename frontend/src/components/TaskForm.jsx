import { useState } from 'react';

const initialState = {
  title: '',
  description: '',
  status: 'pending',
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
      await onTaskCreated(form);
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
        rows={3}
      />

      <select name="status" value={form.status} onChange={handleChange}>
        <option value="pending">Pending</option>
        <option value="in-progress">In Progress</option>
        <option value="completed">Completed</option>
      </select>

      <button type="submit">Create Task</button>
    </form>
  );
}

export default TaskForm;
