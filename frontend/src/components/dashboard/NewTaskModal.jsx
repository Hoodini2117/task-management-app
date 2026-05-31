import { useState, useEffect, useRef } from 'react';

const initialState = {
  title: '',
  description: '',
  status: 'pending',
  priority: 'medium',
  due_date: '',
  due_time: '',
};

function NewTaskModal({ isOpen, onClose, onTaskCreated }) {
  const [form, setForm] = useState(initialState);
  const [error, setError] = useState('');
  const backdropRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return;
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (isOpen) {
      setForm(initialState);
      setError('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleBackdropClick = (e) => {
    if (e.target === backdropRef.current) onClose();
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
      onClose();
    } catch (err) {
      setError('Failed to create task');
    }
  };

  return (
    <div className="modal-backdrop" ref={backdropRef} onClick={handleBackdropClick}>
      <div className="modal-content">
        <div className="modal-header">
          <h2>New Task</h2>
          <button className="modal-close" onClick={onClose}>&times;</button>
        </div>

        <form onSubmit={handleSubmit}>
          {error && <p className="form-error">{error}</p>}

          <div className="modal-field">
            <label>Title</label>
            <input
              type="text"
              name="title"
              placeholder="Task title"
              value={form.title}
              onChange={handleChange}
              autoFocus
            />
          </div>

          <div className="modal-field">
            <label>Description</label>
            <textarea
              name="description"
              placeholder="Description (optional)"
              value={form.description}
              onChange={handleChange}
              rows={3}
            />
          </div>

          <div className="modal-row">
            <div className="modal-field">
              <label>Priority</label>
              <select name="priority" value={form.priority} onChange={handleChange}>
                <option value="low">🟢 Low</option>
                <option value="medium">🟡 Medium</option>
                <option value="high">🔴 High</option>
              </select>
            </div>
            <div className="modal-field">
              <label>Status</label>
              <select name="status" value={form.status} onChange={handleChange}>
                <option value="pending">Pending</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </div>

          <div className="modal-row">
            <div className="modal-field">
              <label>Due Date</label>
              <input
                type="date"
                name="due_date"
                value={form.due_date}
                onChange={handleChange}
              />
            </div>
            <div className="modal-field">
              <label>Due Time</label>
              <input
                type="time"
                name="due_time"
                value={form.due_time}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="modal-actions">
            <button type="button" className="btn-cancel" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn-create">Create Task</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default NewTaskModal;
