export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/** Formats a stored due date (UTC midnight) like "17 Oct 2026". */
export function formatDate(iso) {
  return new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' });
}

/** Today's date as YYYY-MM-DD in the user's own time zone. */
export function todayISO() {
  const d = new Date();
  const pad = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

/** True when a task has a due date in the past and is not completed. */
export function isOverdue(task) {
  return Boolean(task.dueDate) && task.status !== 'Completed' && task.dueDate.slice(0, 10) < todayISO();
}

export function greeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 18) return 'Good afternoon';
  return 'Good evening';
}
