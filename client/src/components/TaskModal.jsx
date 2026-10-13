import { useEffect, useState } from 'react';
import Modal from './Modal';
import Icon from './Icons';
import { Field, TextField, describe } from './Field';
import { CATEGORIES, PRIORITIES, STATUSES } from '../constants';

function TaskForm({ task, onCancel, onSubmit, onBusyChange }) {
  const editing = Boolean(task);
  const [values, setValues] = useState({
    title: task?.title ?? '',
    description: task?.description ?? '',
    category: task?.category ?? 'General',
    priority: task?.priority ?? 'Medium',
    status: task?.status ?? 'Pending',
    dueDate: task?.dueDate ? task.dueDate.slice(0, 10) : '',
  });
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState('');
  const [saving, setSaving] = useState(false);

  // If the form closes after a successful save, make sure the dialog is dismissible again.
  useEffect(() => () => onBusyChange(false), [onBusyChange]);

  const change = (field) => (e) => {
    setValues((v) => ({ ...v, [field]: e.target.value }));
    if (errors[field]) setErrors((er) => ({ ...er, [field]: undefined }));
  };

  function validate() {
    const er = {};
    if (!values.title.trim()) er.title = 'Enter a task title.';
    else if (values.title.trim().length > 120) er.title = 'Title must be 120 characters or fewer.';
    if (values.description.length > 1000) er.description = 'Description must be 1000 characters or fewer.';
    return er;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (saving) return; // prevents double submits
    const er = validate();
    setErrors(er);
    setFormError('');
    const first = Object.keys(er)[0];
    if (first) {
      document.getElementById(`task-${first}`)?.focus();
      return;
    }

    setSaving(true);
    onBusyChange(true);
    try {
      await onSubmit({ ...values, title: values.title.trim(), dueDate: values.dueDate || null });
    } catch (err) {
      setFormError(err.message);
      setErrors(err.errors || {});
      setSaving(false);
      onBusyChange(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="form-grid">
      {formError && (
        <div className="alert alert-error" role="alert">
          <Icon name="alert" />
          <p>
            <strong>Error:</strong> {formError}
          </p>
        </div>
      )}

      <TextField
        id="task-title"
        label="Title"
        value={values.title}
        onChange={change('title')}
        error={errors.title}
        placeholder="e.g. Finish the database assignment"
        maxLength={120}
        autoComplete="off"
        required
        data-autofocus="true"
      />

      <Field id="task-description" label="Description" optional error={errors.description}>
        <textarea
          id="task-description"
          className="input"
          value={values.description}
          onChange={change('description')}
          placeholder="Add any details, links or steps you want to remember"
          maxLength={1000}
          {...describe('task-description', errors.description)}
        />
      </Field>

      <div className="form-grid two">
        <Field id="task-category" label="Category" error={errors.category}>
          <select id="task-category" className="input" value={values.category} onChange={change('category')} {...describe('task-category', errors.category)}>
            {CATEGORIES.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </Field>
        <Field id="task-priority" label="Priority" error={errors.priority}>
          <select id="task-priority" className="input" value={values.priority} onChange={change('priority')} {...describe('task-priority', errors.priority)}>
            {PRIORITIES.map((p) => (
              <option key={p}>{p}</option>
            ))}
          </select>
        </Field>
        <Field id="task-dueDate" label="Due date" optional error={errors.dueDate}>
          <input id="task-dueDate" type="date" className="input" value={values.dueDate} onChange={change('dueDate')} {...describe('task-dueDate', errors.dueDate)} />
        </Field>
        <Field id="task-status" label="Status" error={errors.status}>
          <select id="task-status" className="input" value={values.status} onChange={change('status')} {...describe('task-status', errors.status)}>
            {STATUSES.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
        </Field>
      </div>

      <div className="modal-actions">
        <button type="button" className="btn btn-secondary" onClick={onCancel} disabled={saving}>
          Cancel
        </button>
        <button type="submit" className="btn btn-primary" disabled={saving}>
          {saving && <span className="spinner" aria-hidden="true" />}
          {saving ? 'Saving…' : editing ? 'Save changes' : 'Add task'}
        </button>
      </div>
    </form>
  );
}

/** Add / edit dialog. `task` is null when adding. onSubmit(values) must return a promise. */
export default function TaskModal({ open, task, onClose, onSubmit }) {
  const [busy, setBusy] = useState(false);
  return (
    <Modal open={open} onClose={onClose} title={task ? 'Edit task' : 'Add task'} dismissible={!busy}>
      <TaskForm key={task?.id || 'new'} task={task} onCancel={onClose} onSubmit={onSubmit} onBusyChange={setBusy} />
    </Modal>
  );
}
