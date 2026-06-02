import { isOverdue, isDueToday, isDueTomorrow, isDueThisWeek, isCompletedToday } from './dateUtils';

const PRIORITY_ORDER = { high: 0, medium: 1, low: 2 };

export function getPriorityLabel(priority) {
  const map = { low: '🟢 Low', medium: '🟡 Medium', high: '🔴 High' };
  return map[priority] || priority;
}

export function getPriorityColor(priority) {
  const map = { low: '#51c98e', medium: '#f0ad4e', high: '#e74c3c' };
  return map[priority] || '#8b8da0';
}

export function filterByDueDate(tasks, filter) {
  switch (filter) {
    case 'today':
      return tasks.filter(isDueToday);
    case 'tomorrow':
      return tasks.filter(isDueTomorrow);
    case 'week':
      return tasks.filter(isDueThisWeek);
    case 'overdue':
      return tasks.filter(isOverdue);
    default:
      return tasks;
  }
}

export function filterByPriority(tasks, priority) {
  if (!priority) return tasks;
  return tasks.filter((t) => t.priority === priority);
}

export function filterBySearch(tasks, search) {
  if (!search) return tasks;
  const q = search.toLowerCase();
  return tasks.filter((t) => {
    if (t.title.toLowerCase().includes(q)) return true;
    if (t.description && t.description.toLowerCase().includes(q)) return true;
    if (t.task_code && t.task_code.toLowerCase().includes(q)) return true;
    if (t.assignee_name && t.assignee_name.toLowerCase().includes(q)) return true;
    if (t.assignee_email && t.assignee_email.toLowerCase().includes(q)) return true;
    return false;
  });
}

export function applyQuickFilter(tasks, chip) {
  switch (chip) {
    case 'today':
      return tasks.filter(isDueToday);
    case 'overdue':
      return tasks.filter(isOverdue);
    case 'high':
      return tasks.filter((t) => t.priority === 'high');
    case 'completed-today':
      return tasks.filter(isCompletedToday);
    default:
      return tasks;
  }
}

export function sortTasks(tasks, sortBy) {
  const sorted = [...tasks];
  switch (sortBy) {
    case 'oldest':
      return sorted.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
    case 'due-soonest':
      return sorted.sort((a, b) => {
        if (!a.due_date) return 1;
        if (!b.due_date) return -1;
        return new Date(a.due_date) - new Date(b.due_date);
      });
    case 'due-latest':
      return sorted.sort((a, b) => {
        if (!a.due_date) return 1;
        if (!b.due_date) return -1;
        return new Date(b.due_date) - new Date(a.due_date);
      });
    case 'priority':
      return sorted.sort((a, b) =>
        (PRIORITY_ORDER[a.priority] ?? 1) - (PRIORITY_ORDER[b.priority] ?? 1)
      );
    case 'completed':
      return sorted.sort((a, b) => {
        if (!a.completed_at) return 1;
        if (!b.completed_at) return -1;
        return new Date(b.completed_at) - new Date(a.completed_at);
      });
    default:
      return sorted.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  }
}
