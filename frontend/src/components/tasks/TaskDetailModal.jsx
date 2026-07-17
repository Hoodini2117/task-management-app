import { useState, useEffect, useRef } from 'react';
import {
  FaTimes, FaUser, FaEnvelope, FaCalendarAlt,
  FaCommentDots, FaHistory, FaPaperPlane, FaTrash,
} from 'react-icons/fa';
import { getComments, createComment, deleteComment, getActivities } from '../../services/api';
import { formatDateTime } from '../../utils/dateUtils';

const statusLabels = {
  pending: 'Pending',
  'in-progress': 'In Progress',
  completed: 'Completed',
};

const priorityLabels = {
  high: 'High',
  medium: 'Medium',
  low: 'Low',
};

function TaskDetailModal({ task, onClose, onRefresh }) {
  const [comments, setComments] = useState([]);
  const [activities, setActivities] = useState([]);
  const [activeTab, setActiveTab] = useState('comments');
  const [commentAuthor, setCommentAuthor] = useState('');
  const [commentMessage, setCommentMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const overlayRef = useRef(null);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  useEffect(() => {
    if (task?.id) {
      loadComments();
      loadActivities();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [task?.id]);

  const loadComments = async () => {
    try {
      const res = await getComments(task.id);
      setComments(res.data);
    } catch (err) { /* silent */ }
  };

  const loadActivities = async () => {
    try {
      const res = await getActivities(task.id);
      setActivities(res.data);
    } catch (err) { /* silent */ }
  };

  const handleOverlayClick = (e) => {
    if (e.target === overlayRef.current) onClose();
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!commentAuthor.trim() || !commentMessage.trim()) return;
    setSubmitting(true);
    try {
      await createComment(task.id, {
        author_name: commentAuthor.trim(),
        message: commentMessage.trim(),
      });
      setCommentMessage('');
      loadComments();
      loadActivities();
      if (onRefresh) onRefresh();
    } catch (err) { /* silent */ }
    setSubmitting(false);
  };

  const handleDeleteComment = async (commentId) => {
    try {
      await deleteComment(task.id, commentId);
      loadComments();
      if (onRefresh) onRefresh();
    } catch (err) { /* silent */ }
  };

  if (!task) return null;

  const createdDate = formatDateTime(task.created_at);
  const updatedDate = formatDateTime(task.updated_at);

  return (
    <div className="modal-overlay" ref={overlayRef} onClick={handleOverlayClick}>
      <div className="modal-container detail-modal-container">
        {/* Header */}
        <div className="modal-header detail-modal-header">
          <div className="detail-header-info">
            <span className="task-code-badge">{task.task_code}</span>
            <h2>{task.title}</h2>
          </div>
          <button className="modal-close" onClick={onClose} title="Close">
            <FaTimes />
          </button>
        </div>

        {/* Body */}
        <div className="detail-modal-body">
          {/* Details Grid */}
          <div className="detail-grid">
            <div className="detail-item">
              <span className="detail-label">Status</span>
              <span className={`status-badge status-${task.status}`}>
                {statusLabels[task.status] || task.status}
              </span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Priority</span>
              <span className={`priority-badge priority-${task.priority}`}>
                {priorityLabels[task.priority] || task.priority}
              </span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Due Date</span>
              <span className="detail-value">
                {task.due_date ? (
                  <>
                    <FaCalendarAlt className="detail-icon" />
                    {new Date(task.due_date + 'T00:00:00').toLocaleDateString('en-US', {
                      month: 'short', day: 'numeric', year: 'numeric',
                    })}
                    {task.due_time && <> · {task.due_time}</>}
                  </>
                ) : '—'}
              </span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Assignee</span>
              <span className="detail-value">
                {task.assignee_name ? (
                  <>
                    <FaUser className="detail-icon" />
                    {task.assignee_name}
                    {task.assignee_email && (
                      <a href={`mailto:${task.assignee_email}`} className="detail-email">
                        <FaEnvelope className="detail-icon" />
                        {task.assignee_email}
                      </a>
                    )}
                  </>
                ) : (
                  <span className="text-muted">Unassigned</span>
                )}
              </span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Created</span>
              <span className="detail-value">{createdDate}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Updated</span>
              <span className="detail-value">{updatedDate}</span>
            </div>
          </div>

          {/* Description */}
          {task.description && (
            <div className="detail-description">
              <span className="detail-label">Description</span>
              <p>{task.description}</p>
            </div>
          )}

          {/* Tabs */}
          <div className="detail-tabs">
            <button
              className={`detail-tab ${activeTab === 'comments' ? 'detail-tab-active' : ''}`}
              onClick={() => setActiveTab('comments')}
            >
              <FaCommentDots /> Comments ({comments.length})
            </button>
            <button
              className={`detail-tab ${activeTab === 'activity' ? 'detail-tab-active' : ''}`}
              onClick={() => setActiveTab('activity')}
            >
              <FaHistory /> Activity ({activities.length})
            </button>
          </div>

          {/* Comments Tab */}
          {activeTab === 'comments' && (
            <div className="detail-section">
              <form className="comment-form" onSubmit={handleAddComment}>
                <input
                  type="text"
                  placeholder="Your name"
                  value={commentAuthor}
                  onChange={(e) => setCommentAuthor(e.target.value)}
                  className="comment-author-input"
                />
                <div className="comment-input-row">
                  <input
                    type="text"
                    placeholder="Write a comment..."
                    value={commentMessage}
                    onChange={(e) => setCommentMessage(e.target.value)}
                    className="comment-message-input"
                  />
                  <button
                    type="submit"
                    className="comment-send-btn"
                    disabled={submitting || !commentAuthor.trim() || !commentMessage.trim()}
                    title="Send comment"
                  >
                    <FaPaperPlane />
                  </button>
                </div>
              </form>
              {comments.length === 0 ? (
                <p className="panel-empty">No comments yet</p>
              ) : (
                <div className="comment-list">
                  {comments.map((c) => (
                    <div key={c.id} className="comment-item">
                      <div className="comment-header">
                        <span className="comment-author">{c.author_name}</span>
                        <span className="comment-time">
                          {new Date(c.created_at).toLocaleString('en-US', {
                            month: 'short', day: 'numeric',
                            hour: '2-digit', minute: '2-digit',
                          })}
                        </span>
                      </div>
                      <p className="comment-message">{c.message}</p>
                      <button
                        className="comment-delete-btn"
                        onClick={() => handleDeleteComment(c.id)}
                        title="Delete comment"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Activity Tab */}
          {activeTab === 'activity' && (
            <div className="detail-section">
              {activities.length === 0 ? (
                <p className="panel-empty">No activity yet</p>
              ) : (
                <div className="activity-timeline">
                  {activities.map((a) => (
                    <div key={a.id} className="timeline-item">
                      <div className="timeline-dot" />
                      <div className="timeline-content">
                        <span className="timeline-action">{a.action}</span>
                        <span className="timeline-time">
                          {new Date(a.timestamp).toLocaleString('en-US', {
                            month: 'short', day: 'numeric',
                            hour: '2-digit', minute: '2-digit',
                          })}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default TaskDetailModal;
