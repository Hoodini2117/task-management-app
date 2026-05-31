import { isOverdue, isDueToday, isCompletedToday } from './dateUtils';

export function getDueTodayTasks(tasks, limit = 5) {
  return tasks.filter(isDueToday).slice(0, limit);
}

export function getOverdueTasks(tasks, limit = 5) {
  return tasks.filter(isOverdue).slice(0, limit);
}

export function getUpcomingTasks(tasks, limit = 5) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return tasks
    .filter((t) => {
      if (!t.due_date || t.status === 'completed') return false;
      const due = new Date(t.due_date + 'T00:00:00');
      return due >= today;
    })
    .sort((a, b) => new Date(a.due_date) - new Date(b.due_date))
    .slice(0, limit);
}

export function getRecentCompletions(tasks, limit = 5) {
  return tasks
    .filter((t) => t.status === 'completed' && t.completed_at)
    .sort((a, b) => new Date(b.completed_at) - new Date(a.completed_at))
    .slice(0, limit);
}

export function getCompletedTodayCount(tasks) {
  return tasks.filter(isCompletedToday).length;
}
