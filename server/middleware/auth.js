const jwt = require('jsonwebtoken');
const User = require('../models/User');
const asyncHandler = require('../utils/asyncHandler');
const { COOKIE_NAME } = require('../utils/token');

/** Protects a route: the request must carry a valid login cookie. */
const requireAuth = asyncHandler(async (req, res, next) => {
  const token = req.cookies && req.cookies[COOKIE_NAME];
  if (!token) return res.status(401).json({ success: false, message: 'Please log in to continue.' });

  let payload;
  try {
    payload = jwt.verify(token, process.env.JWT_SECRET);
  } catch {
    return res.status(401).json({ success: false, message: 'Your session has expired. Please log in again.' });
  }

  const user = await User.findById(payload.sub);
  if (!user) return res.status(401).json({ success: false, message: 'Please log in to continue.' });

  req.user = user;
  next();
});

module.exports = { requireAuth };
