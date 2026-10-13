const { CATEGORIES, PRIORITIES, STATUSES } = require('./constants');

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const isString = (v) => typeof v === 'string';

/** Validates registration data. Returns { errors, value }. */
function validateRegister(body = {}) {
  const errors = {};
  const name = isString(body.name) ? body.name.trim() : '';
  const email = isString(body.email) ? body.email.trim().toLowerCase() : '';
  const password = isString(body.password) ? body.password : '';

  if (!name) errors.name = 'Enter your full name.';
  else if (name.length > 80) errors.name = 'Name must be 80 characters or fewer.';

  if (!email) errors.email = 'Enter your email address.';
  else if (!EMAIL_RE.test(email) || email.length > 254) errors.email = 'Enter a valid email address.';

  if (!password) errors.password = 'Enter a password.';
  else if (password.length < 8) errors.password = 'Password must be at least 8 characters.';
  else if (password.length > 72) errors.password = 'Password must be 72 characters or fewer.';
  else if (!/[A-Za-z]/.test(password) || !/\d/.test(password))
    errors.password = 'Password must include at least one letter and one number.';

  return { errors, value: { name, email, password } };
}

/** Validates login data. */
function validateLogin(body = {}) {
  const errors = {};
  const email = isString(body.email) ? body.email.trim().toLowerCase() : '';
  const password = isString(body.password) ? body.password : '';
  if (!email) errors.email = 'Enter your email address.';
  else if (!EMAIL_RE.test(email)) errors.email = 'Enter a valid email address.';
  if (!password) errors.password = 'Enter your password.';
  return { errors, value: { email, password } };
}

/**
 * Validates task data.
 * With { partial: true } only the fields that are present are checked
 * (used for updates such as "mark as completed").
 * Only whitelisted fields are returned, so users can never set userId, createdAt, etc.
 */
function validateTask(body = {}, { partial = false } = {}) {
  const errors = {};
  const value = {};
  const has = (k) => Object.prototype.hasOwnProperty.call(body, k);

  if (!partial || has('title')) {
    const title = isString(body.title) ? body.title.trim() : '';
    if (!title) errors.title = 'Enter a task title.';
    else if (title.length > 120) errors.title = 'Title must be 120 characters or fewer.';
    else value.title = title;
  }

  if (has('description')) {
    if (body.description !== null && body.description !== undefined && !isString(body.description)) {
      errors.description = 'Description must be text.';
    } else {
      const d = (body.description || '').trim();
      if (d.length > 1000) errors.description = 'Description must be 1000 characters or fewer.';
      else value.description = d;
    }
  }

  const enums = [
    ['category', CATEGORIES],
    ['priority', PRIORITIES],
    ['status', STATUSES],
  ];
  for (const [field, allowed] of enums) {
    if (has(field)) {
      if (!allowed.includes(body[field])) errors[field] = `${field} must be one of: ${allowed.join(', ')}.`;
      else value[field] = body[field];
    }
  }

  if (has('dueDate')) {
    if (body.dueDate === null || body.dueDate === '') {
      value.dueDate = null;
    } else if (!isString(body.dueDate) || Number.isNaN(Date.parse(body.dueDate))) {
      errors.dueDate = 'Enter a valid due date.';
    } else {
      value.dueDate = new Date(body.dueDate);
    }
  }

  return { errors, value };
}

/** Escapes characters that have special meaning in a regular expression. */
function escapeRegex(text) {
  return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

module.exports = { validateRegister, validateLogin, validateTask, escapeRegex, EMAIL_RE };
