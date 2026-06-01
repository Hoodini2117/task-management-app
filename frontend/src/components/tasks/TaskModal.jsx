import { useState, useEffect, useRef } from 'react';
import { FaTimes } from 'react-icons/fa';

const initialState = {
  title: '',
  description: '',
  status: 'pending',
  priority: 'medium',
  due_date: '',
  due_time: '',
};

function TaskModal({ onClose, onTaskCreated }) {
  const [form, setForm] = useState(initialState);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const overlayRef = useRef(null);
  const titleRef = useRef(null);

  useEffect(() => {
    titleRef.current?.focus();

    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  const handleOverlayClick = (e) => {
    if (e.target === overlayRef.current) onClose();
  };

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

    setSubmitting(true);
    try {
      await onTaskCreated({
        ...form,
        due_date: form.due_date || null,
        due_time: form.due_time || null,
      });
    } catch (err) {
      setError('Failed to create task');
      setSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" ref={overlayRef} onClick={handleOverlayClick}>
      <div className="modal-container">
        <div className="modal-header">
          <h2>Create New Task</h2>
          <button className="modal-close" onClick={onClose} title="Close">
            <FaTimes />
          </button>
        </div>

        <form className="modal-form" onSubmit={handleSubmit}>
          {error && <p className="modal-error">{error}</p>}

          <div className="modal-field">
            <label htmlFor="modal-title">Title</label>
            <input
              ref={titleRef}
              id="modal-title"
              type="text"
              name="title"
              placeholder="What needs to be done?"
              value={form.title}
              onChange={handleChange}
              autoComplete="off"
            />
          </div>

          <div className="modal-field">
            <label htmlFor="modal-description">Description</label>
            <textarea
              id="modal-description"
              name="description"
              placeholder="Add more details..."
              value={form.description}
              onChange={handleChange}
              rows={3}
            />
          </div>

          <div className="modal-row">
            <div className="modal-field">
              <label htmlFor="modal-priority">Priority</label>
              <select
                id="modal-priority"
                name="priority"
                value={form.priority}
                onChange={handleChange}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
            <div className="modal-field">
              <label htmlFor="modal-status">Status</label>
              <select
                id="modal-status"
                name="status"
                value={form.status}
                onChange={handleChange}
              >
                <option value="pending">Pending</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </div>

          <div className="modal-row">
            <div className="modal-field">
              <label htmlFor="modal-due-date">Due Date</label>
              <input
                id="modal-due-date"
                type="date"
                name="due_date"
                value={form.due_date}
                onChange={handleChange}
              />
            </div>
            <div className="modal-field">
              <label htmlFor="modal-due-time">Due Time</label>
              <input
                id="modal-due-time"
                type="time"
                name="due_time"
                value={form.due_time}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="modal-actions">
            <button type="button" className="modal-btn-cancel" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="modal-btn-submit" disabled={submitting}>
              {submitting ? 'Creating...' : 'Create Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default TaskModal;
