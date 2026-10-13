import Icon from './Icons';

export function PriorityBadge({ priority }) {
  const cls = { High: 'badge-high', Medium: 'badge-medium', Low: 'badge-low' }[priority] || 'badge-low';
  return (
    <span className={`badge ${cls}`}>
      <Icon name="flag" size={13} />
      {priority}
      <span className="sr-only"> priority</span>
    </span>
  );
}

export function StatusBadge({ status }) {
  const map = {
    Pending: ['badge-pending', 'circle'],
    'In Progress': ['badge-progress', 'halfCircle'],
    Completed: ['badge-done', 'check'],
  };
  const [cls, icon] = map[status] || map.Pending;
  return (
    <span className={`badge ${cls}`}>
      <Icon name={icon} size={13} />
      {status}
    </span>
  );
}
