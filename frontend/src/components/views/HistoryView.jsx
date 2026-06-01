import { useState, useEffect, useMemo } from 'react';
import { FaSearch } from 'react-icons/fa';
import { getHistory } from '../../services/api';
import { formatFullDate, formatDateTime } from '../../utils/dateUtils';
import { filterBySearch, filterByPriority, sortTasks } from '../../utils/taskUtils';

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

function HistoryView() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [sortBy, setSortBy] = useState('newest');

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await getHistory();
        setTasks(res.data);
      } catch (err) {
        // silent
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  const filteredTasks = useMemo(() => {
    let result = [...tasks];

    if (statusFilter) {
      result = result.filter((t) => t.status === statusFilter);
    }

    result = filterBySearch(result, search);
    result = filterByPriority(result, priorityFilter);
    result = sortTasks(result, sortBy);

    return result;
  }, [tasks, search, statusFilter, priorityFilter, sortBy]);

  if (loading) {
    return (
      <div className="loader">
        <div className="spinner"></div>
        <p>Loading history...</p>
      </div>
    );
  }

  if (tasks.length === 0) {
    return <p className="empty-state">No task history yet.</p>;
  }

  return (
    <div className="history-view">
      <div className="view-section">
        <div className="section-header">
          <h3 className="section-title">All Task History</h3>
          <span className="task-count-badge">
            {filteredTasks.length} of {tasks.length} tasks
          </span>
        </div>
      </div>

      <div className="history-filters">
        <div className="search-input">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search history..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="filter-row">
          <select
            className="filter-select"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">All Status</option>
            <option value="pending">Pending</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
          <select
            className="filter-select"
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
          >
            <option value="">All Priorities</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
          <select
            className="filter-select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="priority">Priority</option>
            <option value="due-soonest">Due Soonest</option>
          </select>
        </div>
      </div>

      <div className="history-table-wrapper">
        <table className="history-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Status</th>
              <th>Priority</th>
              <th>Due Date</th>
              <th>Created</th>
              <th>Completed</th>
            </tr>
          </thead>
          <tbody>
            {filteredTasks.map((task) => (
              <tr key={task.id} className={task.is_archived ? 'row-archived' : ''}>
                <td>
                  <div className="history-title-cell">
                    <span className="history-title">{task.title}</span>
                    {task.description && (
                      <span className="history-desc">{task.description}</span>
                    )}
                  </div>
                </td>
                <td>
                  <span className={`status-badge status-${task.status}`}>
                    {statusLabels[task.status] || task.status}
                  </span>
                  {task.is_archived && (
                    <span className="status-badge status-archived">Archived</span>
                  )}
                </td>
                <td>
                  <span className={`priority-badge priority-${task.priority}`}>
                    {priorityLabels[task.priority] || task.priority}
                  </span>
                </td>
                <td>
                  {task.due_date ? (
                    <span>
                      {formatFullDate(task.due_date + 'T00:00:00')}
                      {task.due_time && (
                        <span className="history-time"> · {task.due_time}</span>
                      )}
                    </span>
                  ) : (
                    <span className="text-muted">—</span>
                  )}
                </td>
                <td>{formatDateTime(task.created_at)}</td>
                <td>{formatDateTime(task.completed_at)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default HistoryView;
