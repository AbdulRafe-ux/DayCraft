const bcrypt = require('bcryptjs');
const User = require('../models/User');
const asyncHandler = require('../utils/asyncHandler');
const { validateRegister, validateLogin } = require('../utils/validators');
const { setAuthCookie, clearAuthCookie } = require('../utils/token');

const SALT_ROUNDS = 12;
// A throw-away hash so a login for an unknown email takes about as long as a real one.
const DUMMY_HASH = bcrypt.hashSync('daycraft-dummy-password', SALT_ROUNDS);

// POST /api/auth/register
exports.register = asyncHandler(async (req, res) => {
  const { errors, value } = validateRegister(req.body);
  if (Object.keys(errors).length) {
    return res.status(400).json({ success: false, message: 'Please fix the highlighted fields.', errors });
  }

  const existing = await User.findOne({ email: value.email });
  if (existing) {
    return res.status(409).json({
      success: false,
      message: 'An account with this email already exists.',
      errors: { email: 'An account with this email already exists. Try logging in.' },
    });
  }

  const passwordHash = await bcrypt.hash(value.password, SALT_ROUNDS);

  let user;
  try {
    user = await User.create({ name: value.name, email: value.email, passwordHash });
  } catch (err) {
    // Two people registering the same email at the same moment
    if (err.code === 11000) {
      return res.status(409).json({
        success: false,
        message: 'An account with this email already exists.',
        errors: { email: 'An account with this email already exists. Try logging in.' },
      });
    }
    throw err;
  }

  setAuthCookie(res, user._id); // log the new user in straight away
  res.status(201).json({ success: true, message: 'Account created.', user });
});

// POST /api/auth/login
exports.login = asyncHandler(async (req, res) => {
  const { errors, value } = validateLogin(req.body);
  if (Object.keys(errors).length) {
    return res.status(400).json({ success: false, message: 'Please fix the highlighted fields.', errors });
  }

  const user = await User.findOne({ email: value.email }).select('+passwordHash');
  const ok = await bcrypt.compare(value.password, user ? user.passwordHash : DUMMY_HASH);

  // Same message for "no such email" and "wrong password" so attackers cannot probe for accounts.
  if (!user || !ok) {
    return res.status(401).json({ success: false, message: 'Incorrect email or password.' });
  }

  setAuthCookie(res, user._id);
  res.json({ success: true, message: 'Logged in.', user });
});

// POST /api/auth/logout
exports.logout = (req, res) => {
  clearAuthCookie(res);
  res.json({ success: true, message: 'Logged out.' });
};

// GET /api/auth/me
exports.me = (req, res) => {
  res.json({ success: true, user: req.user });
};
