const jwt = require('jsonwebtoken');

const COOKIE_NAME = 'daycraft_token';

function expiresHours() {
  const h = Number(process.env.JWT_EXPIRES_HOURS);
  return Number.isFinite(h) && h > 0 ? h : 2;
}

function signToken(userId) {
  return jwt.sign({ sub: String(userId) }, process.env.JWT_SECRET, {
    expiresIn: `${expiresHours()}h`,
  });
}

function cookieOptions() {
  return {
    httpOnly: true, // JavaScript in the browser cannot read this cookie
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production', // HTTPS only in production
    maxAge: expiresHours() * 60 * 60 * 1000,
    path: '/',
  };
}

function setAuthCookie(res, userId) {
  res.cookie(COOKIE_NAME, signToken(userId), cookieOptions());
}

function clearAuthCookie(res) {
  const { maxAge, ...opts } = cookieOptions();
  res.clearCookie(COOKIE_NAME, opts);
}

module.exports = { COOKIE_NAME, setAuthCookie, clearAuthCookie };
