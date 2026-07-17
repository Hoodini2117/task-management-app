import StatsCards from '../stats/StatsCards';
import QuickCreate from '../tasks/QuickCreate';
import TaskCard from '../tasks/TaskCard';
import { FaExclamationTriangle, FaClock, FaCheckCircle, FaCalendarDay, FaCalendarWeek, FaFire, FaUserFriends } from 'react-icons/fa';
import { isOverdue, isDueToday, isDueThisWeek, isCompletedToday } from '../../utils/dateUtils';
import { getPriorityLabel } from '../../utils/taskUtils';

function DashboardView({ tasks, onTaskCreated, onDelete, onStatusChange, onNavigate, onTaskClick }) {
  const overdueTasks = tasks.filter(isOverdue);
  const dueTodayTasks = tasks.filter(isDueToday);
  const dueThisWeekTasks = tasks.filter(isDueThisWeek);
  const completedTodayTasks = tasks.filter(isCompletedToday);

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

  const recentlyAssigned = tasks
    .filter((t) => t.assignee_name && !t.is_archived)
    .sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at))
    .slice(0, 5);

  return (
    <div className="dashboard-view">
      {/* Top Stats Row */}
      <StatsCards tasks={tasks} />

      {/* Two-Column Dashboard Grid */}
      <div className="dashboard-grid">
        {/* Left Column — Deadline Focus */}
        <div className="dashboard-col-left">
          {/* Due Today */}
          <div className="dashboard-panel">
            <div className="panel-header">
              <div className="panel-title-group">
                <FaCalendarDay className="panel-icon panel-icon-info" />
                <h3>Due Today</h3>
              </div>
              <span className="panel-count">{dueTodayTasks.length}</span>
            </div>
            {dueTodayTasks.length === 0 ? (
              <p className="panel-empty">No tasks due today</p>
            ) : (
              <div className="panel-task-list">
                {dueTodayTasks.map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onDelete={onDelete}
                    onStatusChange={onStatusChange}
                    onTaskClick={onTaskClick}
                    compact
                  />
                ))}
              </div>
            )}
          </div>

          {/* Overdue Tasks */}
          {overdueTasks.length > 0 && (
            <div className="dashboard-panel panel-overdue">
              <div className="panel-header">
                <div className="panel-title-group">
                  <FaExclamationTriangle className="panel-icon panel-icon-danger" />
                  <h3>Overdue</h3>
                </div>
                <span className="panel-count panel-count-danger">{overdueTasks.length}</span>
              </div>
              <div className="panel-task-list">
                {overdueTasks.map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onDelete={onDelete}
                    onStatusChange={onStatusChange}
                    onTaskClick={onTaskClick}
                    compact
                  />
                ))}
              </div>
            </div>
          )}

          {/* Due This Week */}
          <div className="dashboard-panel">
            <div className="panel-header">
              <div className="panel-title-group">
                <FaCalendarWeek className="panel-icon panel-icon-primary" />
                <h3>Due This Week</h3>
              </div>
              <span className="panel-count">{dueThisWeekTasks.length}</span>
            </div>
            {dueThisWeekTasks.length === 0 ? (
              <p className="panel-empty">No tasks due this week</p>
            ) : (
              <div className="panel-task-list">
                {dueThisWeekTasks.map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onDelete={onDelete}
                    onStatusChange={onStatusChange}
                    onTaskClick={onTaskClick}
                    compact
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column — Actions & Insights */}
        <div className="dashboard-col-right">
          {/* Quick Add */}
          <div className="dashboard-panel">
            <div className="panel-header">
              <h3>Quick Add</h3>
            </div>
            <QuickCreate onTaskCreated={onTaskCreated} />
          </div>

          {/* Today's Momentum */}
          <div className="dashboard-panel panel-momentum">
            <div className="panel-header">
              <div className="panel-title-group">
                <FaFire className="panel-icon panel-icon-success" />
                <h3>Today's Momentum</h3>
              </div>
            </div>
            <div className="momentum-content">
              <span className="momentum-count">{completedTodayTasks.length}</span>
              <span className="momentum-label">
                task{completedTodayTasks.length !== 1 ? 's' : ''} completed today
              </span>
            </div>
          </div>

          {/* Recently Assigned Tasks */}
          {recentlyAssigned.length > 0 && (
            <div className="dashboard-panel">
              <div className="panel-header">
                <div className="panel-title-group">
                  <FaUserFriends className="panel-icon panel-icon-primary" />
                  <h3>Recently Assigned</h3>
                </div>
              </div>
              <div className="upcoming-list">
                {recentlyAssigned.map((task) => (
                  <div key={task.id} className="upcoming-item" onClick={() => onTaskClick && onTaskClick(task)} style={{ cursor: 'pointer' }}>
                    <div className="upcoming-info">
                      <span className="upcoming-title">
                        <span className="task-code-badge" style={{ marginRight: '0.4rem' }}>{task.task_code}</span>
                        {task.title}
                      </span>
                      <span className="upcoming-date">
                        {task.assignee_name}
                        {task.assignee_email && ` · ${task.assignee_email}`}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Upcoming Deadlines */}
          {upcomingTasks.length > 0 && (
            <div className="dashboard-panel">
              <div className="panel-header">
                <div className="panel-title-group">
                  <FaClock className="panel-icon panel-icon-warning" />
                  <h3>Upcoming Deadlines</h3>
                </div>
              </div>
              <div className="upcoming-list">
                {upcomingTasks.map((task) => (
                  <div key={task.id} className="upcoming-item">
                    <div className="upcoming-info">
                      <span className="upcoming-title">{task.title}</span>
                      <span className="upcoming-date">
                        {new Date(task.due_date + 'T00:00:00').toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                        })}
                        {task.due_time && ` · ${task.due_time}`}
                      </span>
                    </div>
                    <span className={`priority-pill priority-${task.priority}`}>
                      {task.priority}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Recent Completions */}
          {recentCompletions.length > 0 && (
            <div className="dashboard-panel">
              <div className="panel-header">
                <div className="panel-title-group">
                  <FaCheckCircle className="panel-icon panel-icon-success" />
                  <h3>Recent Completions</h3>
                </div>
              </div>
              <div className="upcoming-list">
                {recentCompletions.map((task) => (
                  <div key={task.id} className="upcoming-item">
                    <div className="upcoming-info">
                      <span className="upcoming-title">{task.title}</span>
                      <span className="upcoming-date">
                        {new Date(task.completed_at).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                        })}
                        {' · '}
                        {new Date(task.completed_at).toLocaleTimeString('en-US', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default DashboardView;
