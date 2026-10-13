const express = require('express');
const rateLimit = require('express-rate-limit');
const { register, login, logout, me } = require('../controllers/authController');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

// Slows down password-guessing: 50 attempts per 15 minutes per IP address.
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 50,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many attempts. Please wait a few minutes and try again.' },
});

router.post('/register', authLimiter, register);
router.post('/login', authLimiter, login);
router.post('/logout', logout);
router.get('/me', requireAuth, me);

module.exports = router;
