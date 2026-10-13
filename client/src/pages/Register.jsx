import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Logo from '../components/Logo';
import Icon from '../components/Icons';
import { TextField, PasswordField } from '../components/Field';
import { useAuth } from '../context/AuthContext';
import { EMAIL_RE } from '../utils';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [values, setValues] = useState({ name: '', email: '', password: '', confirm: '' });
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const change = (field) => (e) => {
    setValues((v) => ({ ...v, [field]: e.target.value }));
    if (errors[field]) setErrors((er) => ({ ...er, [field]: undefined }));
  };

  function validate() {
    const er = {};
    if (!values.name.trim()) er.name = 'Enter your full name.';
    if (!values.email.trim()) er.email = 'Enter your email address.';
    else if (!EMAIL_RE.test(values.email.trim())) er.email = 'Enter a valid email address.';
    if (!values.password) er.password = 'Enter a password.';
    else if (values.password.length < 8) er.password = 'Password must be at least 8 characters.';
    else if (!/[A-Za-z]/.test(values.password) || !/\d/.test(values.password))
      er.password = 'Password must include at least one letter and one number.';
    if (!values.confirm) er.confirm = 'Re-enter your password to confirm it.';
    else if (values.confirm !== values.password) er.confirm = 'Passwords do not match.';
    return er;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (submitting) return; // stops accidental double submissions
    const er = validate();
    setErrors(er);
    setFormError('');
    const first = Object.keys(er)[0];
    if (first) {
      document.getElementById(first)?.focus();
      return;
    }

    setSubmitting(true);
    try {
      // The server creates the account and logs the new user in, then we open the dashboard.
      await register({ name: values.name.trim(), email: values.email.trim(), password: values.password });
      navigate('/dashboard', { replace: true });
    } catch (err) {
      setFormError(err.message);
      setErrors(err.errors || {});
      setSubmitting(false);
    }
  }

  return (
    <main className="auth-page" id="main">
      <div className="auth-wrap">
        <Logo />
        <div className="auth-intro">
          <h1>Create your account</h1>
          <p>Start organising your days in under a minute.</p>
        </div>

        <form className="auth-panel" onSubmit={handleSubmit} noValidate>
          {formError && (
            <div className="alert alert-error" role="alert">
              <Icon name="alert" />
              <p>
                <strong>Error:</strong> {formError}
              </p>
            </div>
          )}
          <TextField id="name" label="Full name" autoComplete="name" placeholder="Your full name" value={values.name} onChange={change('name')} error={errors.name} maxLength={80} />
          <TextField id="email" label="Email address" type="email" autoComplete="email" inputMode="email" placeholder="you@example.com" value={values.email} onChange={change('email')} error={errors.email} />
          <PasswordField id="password" label="Password" autoComplete="new-password" placeholder="At least 8 characters" hint="Use at least 8 characters, with a letter and a number." value={values.password} onChange={change('password')} error={errors.password} />
          <PasswordField id="confirm" label="Confirm password" autoComplete="new-password" placeholder="Type the password again" value={values.confirm} onChange={change('confirm')} error={errors.confirm} />
          <button type="submit" className="btn btn-primary btn-lg btn-block" disabled={submitting}>
            {submitting && <span className="spinner" aria-hidden="true" />}
            {submitting ? 'Creating account…' : 'Create account'}
          </button>
        </form>

        <p className="auth-switch">
          Already have an account? <Link to="/login">Log in</Link>
        </p>
        <Link to="/" className="auth-back">
          Back to the home page
        </Link>
      </div>
    </main>
  );
}
