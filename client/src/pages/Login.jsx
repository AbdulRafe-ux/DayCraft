import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Logo from '../components/Logo';
import Icon from '../components/Icons';
import { TextField, PasswordField } from '../components/Field';
import { useAuth } from '../context/AuthContext';
import { EMAIL_RE } from '../utils';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [values, setValues] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const change = (field) => (e) => {
    setValues((v) => ({ ...v, [field]: e.target.value }));
    if (errors[field]) setErrors((er) => ({ ...er, [field]: undefined }));
  };

  function validate() {
    const er = {};
    if (!values.email.trim()) er.email = 'Enter your email address.';
    else if (!EMAIL_RE.test(values.email.trim())) er.email = 'Enter a valid email address.';
    if (!values.password) er.password = 'Enter your password.';
    return er;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (submitting) return;
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
      await login(values.email.trim(), values.password);
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
          <h1>Welcome back</h1>
          <p>Log in to see today's tasks.</p>
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
          <TextField id="email" label="Email address" type="email" autoComplete="email" inputMode="email" placeholder="you@example.com" value={values.email} onChange={change('email')} error={errors.email} />
          <PasswordField id="password" label="Password" autoComplete="current-password" placeholder="Your password" value={values.password} onChange={change('password')} error={errors.password} />
          <button type="submit" className="btn btn-primary btn-lg btn-block" disabled={submitting}>
            {submitting && <span className="spinner" aria-hidden="true" />}
            {submitting ? 'Logging in…' : 'Log in'}
          </button>
        </form>

        <p className="auth-switch">
          New to DayCraft? <Link to="/register">Create an account</Link>
        </p>
        <Link to="/" className="auth-back">
          Back to the home page
        </Link>
      </div>
    </main>
  );
}
