const test = require('node:test');
const assert = require('node:assert');
const { validateRegister, validateLogin, validateTask, escapeRegex } = require('../utils/validators');

test('register: accepts valid data and normalises the email', () => {
  const { errors, value } = validateRegister({ name: ' Asha ', email: ' ASHA@Example.com ', password: 'secret123' });
  assert.deepStrictEqual(errors, {});
  assert.strictEqual(value.email, 'asha@example.com');
  assert.strictEqual(value.name, 'Asha');
});

test('register: rejects short, letter-only and missing passwords', () => {
  assert.ok(validateRegister({ name: 'A', email: 'a@b.co', password: 'abc1' }).errors.password);
  assert.ok(validateRegister({ name: 'A', email: 'a@b.co', password: 'abcdefgh' }).errors.password);
  assert.ok(validateRegister({ name: 'A', email: 'a@b.co' }).errors.password);
});

test('register: rejects bad email and missing name', () => {
  const { errors } = validateRegister({ name: '', email: 'not-an-email', password: 'secret123' });
  assert.ok(errors.name);
  assert.ok(errors.email);
});

test('register: rejects non-string values (NoSQL injection attempt)', () => {
  const { errors } = validateRegister({ name: 'A', email: { $gt: '' }, password: 'secret123' });
  assert.ok(errors.email);
});

test('login: requires email and password', () => {
  const { errors } = validateLogin({});
  assert.ok(errors.email && errors.password);
});

test('task: title is required and enums are enforced', () => {
  assert.ok(validateTask({}).errors.title);
  assert.ok(validateTask({ title: 'x', priority: 'Urgent' }).errors.priority);
  assert.ok(validateTask({ title: 'x', status: 'Done' }).errors.status);
  assert.deepStrictEqual(validateTask({ title: 'x', priority: 'High', status: 'Pending' }).errors, {});
});

test('task: ignores fields users must not set', () => {
  const { value } = validateTask({ title: 'x', userId: 'someone-else', createdAt: '2020-01-01' });
  assert.strictEqual(value.userId, undefined);
  assert.strictEqual(value.createdAt, undefined);
});

test('task: due date handling', () => {
  assert.ok(validateTask({ title: 'x', dueDate: 'nonsense' }).errors.dueDate);
  assert.strictEqual(validateTask({ title: 'x', dueDate: '' }).value.dueDate, null);
  assert.ok(validateTask({ title: 'x', dueDate: '2026-10-17' }).value.dueDate instanceof Date);
});

test('task: partial update only checks present fields', () => {
  const { errors, value } = validateTask({ status: 'Completed' }, { partial: true });
  assert.deepStrictEqual(errors, {});
  assert.deepStrictEqual(value, { status: 'Completed' });
  assert.ok(validateTask({ title: '   ' }, { partial: true }).errors.title);
});

test('escapeRegex neutralises regex characters', () => {
  assert.strictEqual(escapeRegex('a.b*c'), 'a\\.b\\*c');
});
