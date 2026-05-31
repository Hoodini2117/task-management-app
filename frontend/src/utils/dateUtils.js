export function getToday() {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
}

export function parseDate(dateStr) {
  if (!dateStr) return null;
  return new Date(dateStr + 'T00:00:00');
}

export function isOverdue(task) {
  if (!task.due_date || task.status === 'completed') return false;
  const due = parseDate(task.due_date);
  return due && due < getToday();
}

export function isDueToday(task) {
  if (!task.due_date || task.status === 'completed') return false;
  const due = parseDate(task.due_date);
  return due && due.getTime() === getToday().getTime();
}

export function isDueTomorrow(task) {
  if (!task.due_date || task.status === 'completed') return false;
  const due = parseDate(task.due_date);
  const tomorrow = getToday();
  tomorrow.setDate(tomorrow.getDate() + 1);
  return due && due.getTime() === tomorrow.getTime();
}

export function isDueThisWeek(task) {
  if (!task.due_date || task.status === 'completed') return false;
  const due = parseDate(task.due_date);
  if (!due) return false;
  const today = getToday();
  const weekEnd = new Date(today);
  weekEnd.setDate(weekEnd.getDate() + 7);
  return due >= today && due < weekEnd;
}

export function isCompletedToday(task) {
  if (task.status !== 'completed' || !task.completed_at) return false;
  const completed = new Date(task.completed_at);
  const today = getToday();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  return completed >= today && completed < tomorrow;
}

export function formatShortDate(dateStr) {
  if (!dateStr) return '—';
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export function formatFullDate(dateStr) {
  if (!dateStr) return '—';
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export function formatDateTime(dateStr) {
  if (!dateStr) return '—';
  const d = new Date(dateStr);
  return d.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}
