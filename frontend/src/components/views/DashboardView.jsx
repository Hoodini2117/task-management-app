import StatsCards from '../stats/StatsCards';
import QuickCreate from '../tasks/QuickCreate';
import TaskCard from '../tasks/TaskCard';
import { FaArrowRight, FaExclamationTriangle, FaClock, FaCheckCircle, FaCalendarDay, FaCalendarWeek } from 'react-icons/fa';
import { isOverdue, isDueToday, isDueThisWeek } from '../../utils/dateUtils';
import { getPriorityLabel } from '../../utils/taskUtils';

function DashboardView({ tasks, onTaskCreated, onDelete, onStatusChange, onNavigate }) {
  const overdueTasks = tasks.filter(isOverdue);
  const dueTodayTasks = tasks.filter(isDueToday);
  const dueThisWeekTasks = tasks.filter(isDueThisWeek);

  const upcomingTasks = tasks
    .filter((t) => {
      if (!t.due_date || t.status === 'completed') return false;
      const due = new Date(t.due_date + 'T00:00:00');
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return due >= today;
    })
    .sort((a, b) => new Date(a.due_date) - new Date(b.due_date))
    .slice(0, 5);

  const recentCompletions = tasks
    .filter((t) => t.status === 'completed' && t.completed_at)
    .sort((a, b) => new Date(b.completed_at) - new Date(a.completed_at))
    .slice(0, 5);

  const recentTasks = tasks.slice(0, 5);

  return (
    <div className="dashboard-view">
      <StatsCards tasks={tasks} />

      {/* Deadline Insights */}
      <div className="deadline-insights">
        <div className="insight-card insight-today">
          <div className="insight-icon">
            <FaCalendarDay />
          </div>
          <div className="insight-info">
            <span className="insight-count">{dueTodayTasks.length}</span>
            <span className="insight-label">Due Today</span>
          </div>
        </div>
        <div className="insight-card insight-overdue">
          <div className="insight-icon">
            <FaExclamationTriangle />
          </div>
          <div className="insight-info">
            <span className="insight-count">{overdueTasks.length}</span>
            <span className="insight-label">Overdue</span>
          </div>
        </div>
        <div className="insight-card insight-week">
          <div className="insight-icon">
            <FaCalendarWeek />
          </div>
          <div className="insight-info">
            <span className="insight-count">{dueThisWeekTasks.length}</span>
            <span className="insight-label">Due This Week</span>
          </div>
        </div>
      </div>

      <div className="view-section">
        <h3 className="section-title">Quick Add</h3>
        <QuickCreate onTaskCreated={onTaskCreated} />
      </div>

      {/* Overdue Tasks */}
      {overdueTasks.length > 0 && (
        <div className="view-section">
          <div className="section-header">
            <h3 className="section-title section-title-overdue">
              <FaExclamationTriangle style={{ marginRight: 6 }} />
              Overdue Tasks
            </h3>
          </div>
          <div className="task-list">
            {overdueTasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onDelete={onDelete}
                onStatusChange={onStatusChange}
              />
            ))}
          </div>
        </div>
      )}

      {/* Upcoming Deadlines */}
      {upcomingTasks.length > 0 && (
        <div className="view-section">
          <div className="section-header">
            <h3 className="section-title section-title-upcoming">
              <FaClock style={{ marginRight: 6 }} />
              Upcoming Deadlines
            </h3>
          </div>
          <div className="upcoming-list">
            {upcomingTasks.map((task) => (
              <div key={task.id} className="upcoming-item">
                <div className="upcoming-title">{task.title}</div>
                <div className="upcoming-meta">
                  <span className="upcoming-date">
                    {new Date(task.due_date + 'T00:00:00').toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                    })}
                  </span>
                  <span className={`upcoming-priority priority-${task.priority}`}>
                    {getPriorityLabel(task.priority)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent Completions */}
      {recentCompletions.length > 0 && (
        <div className="view-section">
          <div className="section-header">
            <h3 className="section-title section-title-completions">
              <FaCheckCircle style={{ marginRight: 6 }} />
              Recent Completions
            </h3>
          </div>
          <div className="task-list">
            {recentCompletions.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onDelete={onDelete}
                onStatusChange={onStatusChange}
              />
            ))}
          </div>
        </div>
      )}

      {/* Recent Tasks */}
      <div className="view-section">
        <div className="section-header">
          <h3 className="section-title">Recent Tasks</h3>
          <button className="link-btn" onClick={() => onNavigate('all')}>
            View all <FaArrowRight />
          </button>
        </div>

        {recentTasks.length === 0 ? (
          <p className="empty-state">No tasks yet. Add one above!</p>
        ) : (
          <div className="task-list">
            {recentTasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onDelete={onDelete}
                onStatusChange={onStatusChange}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default DashboardView;
