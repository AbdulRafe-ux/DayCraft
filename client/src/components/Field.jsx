import { useState } from 'react';
import Icon from './Icons';

/** Label + control + hint/error, wired together for screen readers. */
export function Field({ id, label, error, hint, optional, children }) {
  return (
    <div className="field">
      <label htmlFor={id}>
        {label}
        {optional && <span className="optional"> (optional)</span>}
      </label>
      {children}
      {hint && !error && (
        <p className="field-hint" id={`${id}-hint`}>
          {hint}
        </p>
      )}
      {error && (
        <p className="field-error" id={`${id}-error`}>
          <Icon name="alert" size={16} />
          <span>
            <span className="sr-only">Error: </span>
            {error}
          </span>
        </p>
      )}
    </div>
  );
}

/** aria attributes for an input that has an error and/or a hint. */
export const describe = (id, error, hint) => ({
  'aria-invalid': error ? 'true' : undefined,
  'aria-describedby': error ? `${id}-error` : hint ? `${id}-hint` : undefined,
});

export function TextField({ id, label, error, hint, optional, ...inputProps }) {
  return (
    <Field id={id} label={label} error={error} hint={hint} optional={optional}>
      <input id={id} className="input" {...describe(id, error, hint)} {...inputProps} />
    </Field>
  );
}

export function PasswordField({ id, label, error, hint, ...inputProps }) {
  const [show, setShow] = useState(false);
  return (
    <Field id={id} label={label} error={error} hint={hint}>
      <div className="password-wrap">
        <input
          id={id}
          className="input"
          type={show ? 'text' : 'password'}
          {...describe(id, error, hint)}
          {...inputProps}
        />
        <button
          type="button"
          className="btn btn-ghost btn-icon password-toggle"
          onClick={() => setShow((s) => !s)}
          aria-label={show ? 'Hide password' : 'Show password'}
          aria-pressed={show}
        >
          <Icon name={show ? 'eyeOff' : 'eye'} size={20} />
        </button>
      </div>
    </Field>
  );
}
