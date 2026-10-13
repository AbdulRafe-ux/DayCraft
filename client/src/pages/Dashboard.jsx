import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Logo from '../components/Logo';
import Icon from '../components/Icons';
import { PriorityBadge, StatusBadge } from '../components/Badges';
import TaskModal from '../components/TaskModal';
import ConfirmDialog from '../components/ConfirmDialog';
import { useToast } from '../components/Toast';
import { useAuth } from '../context/AuthContext';
import useDebounce from '../hooks/useDebounce';
import { api } from '../services/api';
import { PRIORITIES } from '../constants';
import { formatDate, greeting, isOverdue } from '../utils';

const EMPTY_STATS = { total: 0, pending: 0, inProgress: 0, completed: 0, overdue: 0 };

const NAV = [
  { key: '', label: 'All tasks', stat: 'total', icon: 'list' },
  { key: 'Pending', label: 'Pending', stat: 'pending', icon: 'circle' },
  { key: 'In Progress', label: 'In progress', stat: 'inProgress', icon: 'halfCircle' },
  { key: 'Completed', label: 'Completed', stat: 'completed', icon: 'check' },
];

export default function Dashboard() {
  const { user, logout, expireSession } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  const [filters, setFilters] = useState({ search: '', status: '', priority: '', sort: 'newest' });
  const search = useDebounce(filters.search, 300);

  const [tasks, setTasks] = useState([]);
  const [stats, setStats] = useState(EMPTY_STATS);
  const [view, setView] = useState('loading'); // 'loading' | 'ready' | 'error'
  const [errorMsg, setErrorMsg] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  const [editorOpen, setEditorOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const [deleteBusy, setDeleteBusy] = useState(false);
  const [deleteError, setDeleteError] = useState('');
  const [busyIds, setBusyIds] = useState([]);
  const abortRef = useRef(null);

  // Loads tasks + statistics from the API (which reads MongoDB) using the current filters.
  const load = useCallback(async () => {
    abortRef.current?.abort();
    const ctrl = new AbortController();
    abortRef.current = ctrl;
    setRefreshing(true);
    try {
      const data = await api.getTasks({ search, status: filters.status, priority: filters.priority, sort: filters.sort }, ctrl.signal);
      setTasks(data.tasks);
      setStats(data.stats);
      setErrorMsg('');
      setView('ready');
    } catch (err) {
      if (err.name === 'AbortError') return;
      if (err.status === 401) return expireSession();
      setErrorMsg(err.message);
      setView('error');
    } finally {
      if (abortRef.current === ctrl) setRefreshing(false);
    }
  }, [search, filters.status, filters.priority, filters.sort, expireSession]);

  useEffect(() => {
    load();
    return () => abortRef.current?.abort();
  }, [load]);

  const setFilter = (field) => (e) => setFilters((f) => ({ ...f, [field]: e.target.value }));
  const hasFilters = Boolean(filters.search || filters.status || filters.priority);
  const clearFilters = () => setFilters((f) => ({ ...f, search: '', status: '', priority: '' }));

  function openAdd() {
    setEditing(null);
    setEditorOpen(true);
  }
  function openEdit(task) {
    setEditing(task);
    setEditorOpen(true);
  }

  async function saveTask(values) {
    try {
      if (editing) {
        await api.updateTask(editing.id, values);
        toast.success('Task updated.');
      } else {
        await api.createTask(values);
        toast.success('Task added.');
      }
    } catch (err) {
      if (err.status === 401) expireSession();
      throw err; // the form shows the message
    }
    setEditorOpen(false);
    setEditing(null);
    await load();
  }

  async function toggleDone(task) {
    const next = task.status === 'Completed' ? 'Pending' : 'Completed';
    setBusyIds((ids) => [...ids, task.id]);
    try {
      await api.updateTask(task.id, { status: next });
      toast.success(next === 'Completed' ? 'Task marked as completed.' : 'Task moved back to pending.');
      await load();
    } catch (err) {
      if (err.status === 401) return expireSession();
      toast.error(err.message);
    } finally {
      setBusyIds((ids) => ids.filter((i) => i !== task.id));
    }
  }

  async function confirmDelete() {
    setDeleteBusy(true);
    setDeleteError('');
    try {
      await api.deleteTask(deleting.id);
      toast.success('Task deleted.');
      setDeleting(null);
      await load();
    } catch (err) {
      if (err.status === 401) return expireSession();
      setDeleteError(err.message);
    } finally {
      setDeleteBusy(false);
    }
  }

  async function handleLogout() {
    navigate('/', { replace: true });
    await logout();
  }

  const percent = stats.total ? Math.round((stats.completed / stats.total) * 100) : 0;
  const firstName = user?.name?.split(' ')[0] || 'there';
  const today = new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' });

  return (
    <>
      <a className="skip-link" href="#main">Skip to main content</a>

      <header className="app-header">
        <div className="container inner">
          <Logo to="/dashboard" />
          <div className="header-user">
            <span className="who">{user?.name}</span>
            <button type="button" className="btn btn-secondary btn-sm" onClick={handleLogout}>
              <Icon name="logout" size={18} />
              Log out
            </button>
          </div>
        </div>
      </header>

      <div className="container app-body">
        <nav className="app-nav" aria-label="Task views">
          <h2>Your tasks</h2>
          <ul>
            {NAV.map((item) => (
              <li key={item.label}>
                <button type="button" className="nav-item" aria-current={filters.status === item.key ? 'true' : undefined} onClick={() => setFilters((f) => ({ ...f, status: item.key }))}>
                  <Icon name={item.icon} size={18} />
                  {item.label}
                  <span className="count">{stats[item.stat]}</span>
                </button>
              </li>
            ))}
          </ul>
        </nav>

        <main id="main" className="dash">
          <div className="page-head">
            <div>
              <h1>{greeting()}, {firstName}</h1>
              <p>{today}</p>
            </div>
            <button type="button" className="btn btn-primary btn-lg" onClick={openAdd}>
              <Icon name="plus" size={20} />
              Add task
            </button>
          </div>

          <section aria-label="Task summary" className="dash">
            <div className="stats">
              <div className="stat total"><strong>{stats.total}</strong><span>Total tasks</span></div>
              <div className="stat pending"><strong>{stats.pending}</strong><span>Pending</span></div>
              <div className="stat active"><strong>{stats.inProgress}</strong><span>In progress</span></div>
              <div className="stat completed"><strong>{stats.completed}</strong><span>Completed</span></div>
            </div>
            <div className="progress-strip">
              <div className="row">
                <span>{stats.completed} of {stats.total} tasks completed ({percent}%)</span>
                {stats.overdue > 0 && (
                  <span className="overdue-note"><Icon name="alert" size={16} />{stats.overdue} overdue</span>
                )}
              </div>
              <div className="progress" role="progressbar" aria-label="Completed tasks" aria-valuemin={0} aria-valuemax={100} aria-valuenow={percent}>
                <span style={{ width: `${percent}%` }} />
              </div>
            </div>
          </section>

          <div className="toolbar" role="search">
            <div className="search">
              <Icon name="search" size={20} />
              <label className="sr-only" htmlFor="search">Search tasks by title</label>
              <input id="search" type="search" className="input" placeholder="Search tasks by title" value={filters.search} onChange={setFilter('search')} autoComplete="off" />
            </div>
            <label className="sr-only" htmlFor="filter-priority">Filter by priority</label>
            <select id="filter-priority" className="input" value={filters.priority} onChange={setFilter('priority')}>
              <option value="">All priorities</option>
              {PRIORITIES.map((p) => <option key={p} value={p}>{p} priority</option>)}
            </select>
            <label className="sr-only" htmlFor="sort">Sort tasks</label>
            <select id="sort" className="input" value={filters.sort} onChange={setFilter('sort')}>
              <option value="newest">Newest first</option>
              <option value="due">Due date</option>
              <option value="priority">Priority</option>
            </select>
          </div>

          <p className="sr-only" aria-live="polite">{view === 'ready' ? `${tasks.length} tasks shown` : ''}</p>

          {view === 'loading' && (
            <div aria-busy="true" aria-label="Loading tasks" className="task-list">
              <div className="skeleton" /><div className="skeleton" /><div className="skeleton" />
            </div>
          )}

          {view === 'error' && (
            <div className="alert alert-error" role="alert">
              <Icon name="alert" />
              <div>
                <p><strong>Error:</strong> {errorMsg}</p>
                <button type="button" className="btn btn-navy btn-sm" onClick={load}>Try again</button>
              </div>
            </div>
          )}

          {view === 'ready' && tasks.length === 0 && (
            <div className="empty">
              <div className="empty-icon"><Icon name={hasFilters ? 'search' : 'clipboard'} size={26} /></div>
              {hasFilters ? (
                <>
                  <h2>No tasks match these filters</h2>
                  <p>Try a different search term or priority, or clear the filters to see everything.</p>
                  <button type="button" className="btn btn-secondary" onClick={clearFilters}>Clear filters</button>
                </>
              ) : filters.status ? (
                <>
                  <h2>Nothing here yet</h2>
                  <p>You have no {filters.status.toLowerCase()} tasks right now.</p>
                  <button type="button" className="btn btn-secondary" onClick={() => setFilters((f) => ({ ...f, status: '' }))}>Show all tasks</button>
                </>
              ) : (
                <>
                  <h2>Your list is empty</h2>
                  <p>Add your first task to start shaping your day. You can set a priority and a due date as you go.</p>
                  <button type="button" className="btn btn-primary" onClick={openAdd}><Icon name="plus" size={18} />Add your first task</button>
                </>
              )}
            </div>
          )}

          {view === 'ready' && tasks.length > 0 && (
            <>
              <div className="task-head" aria-hidden="true">
                <span /><span>Task</span><span>Category</span><span>Priority</span><span>Status</span><span>Due</span><span />
              </div>
              <ul className="task-list" aria-busy={refreshing}>
                {tasks.map((task) => {
                  const done = task.status === 'Completed';
                  const overdue = isOverdue(task);
                  return (
                    <li key={task.id} className={`task ${done ? 'is-completed' : ''}`}>
                      <button
                        type="button"
                        className="task-check"
                        aria-pressed={done}
                        aria-label={done ? `Mark "${task.title}" as pending` : `Mark "${task.title}" as completed`}
                        onClick={() => toggleDone(task)}
                        disabled={busyIds.includes(task.id)}
                      >
                        {done && <Icon name="check" size={16} />}
                      </button>
                      <div className="task-main">
                        <h3 className="task-title">{task.title}</h3>
                        {task.description && <p className="task-desc">{task.description}</p>}
                      </div>
                      <div className="task-meta">
                        <span className="badge badge-category">{task.category}</span>
                        <PriorityBadge priority={task.priority} />
                        <StatusBadge status={task.status} />
                        <span className={`due ${overdue ? 'is-overdue' : ''}`}>
                          {task.dueDate ? (
                            <>
                              <Icon name={overdue ? 'alert' : 'calendar'} size={15} />
                              {overdue && <span>Overdue: </span>}
                              {formatDate(task.dueDate)}
                            </>
                          ) : (
                            <span className="none">No due date</span>
                          )}
                        </span>
                      </div>
                      <div className="task-actions">
                        <button type="button" className="btn btn-ghost btn-icon" onClick={() => openEdit(task)} aria-label={`Edit "${task.title}"`} title="Edit">
                          <Icon name="edit" size={19} />
                        </button>
                        <button type="button" className="btn btn-ghost btn-icon" onClick={() => { setDeleteError(''); setDeleting(task); }} aria-label={`Delete "${task.title}"`} title="Delete">
                          <Icon name="trash" size={19} />
                        </button>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </>
          )}
        </main>
      </div>

      <TaskModal open={editorOpen} task={editing} onClose={() => { setEditorOpen(false); setEditing(null); }} onSubmit={saveTask} />
      <ConfirmDialog
        open={Boolean(deleting)}
        title="Delete this task?"
        message={deleting ? `"${deleting.title}" will be permanently removed. This cannot be undone.` : ''}
        busy={deleteBusy}
        error={deleteError}
        onConfirm={confirmDelete}
        onCancel={() => setDeleting(null)}
      />
    </>
  );
}
