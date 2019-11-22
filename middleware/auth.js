const config = require('../config/config');
const jwt = require('jsonwebtoken');
// Middleware to protect routes
const auth = (req, res, next) => {
  const token = req.session.token;
  // Check for token
  if (!token) {
    // Don't continue after middleware, send session message
    req.session.flash = {
      type: 'danger',
      msg: 'No token, authorization denied'
    };
    // Remove user and token from session
    req.session.user = null;
    req.session.token = null;
    // Check for DELETE request for handling client-side XHR
    return req.method == 'DELETE'
      ? res.status(400).json({ msg: 'No token, authorization denied' })
      : res.redirect('/');
  }
  try {
    // Verify token
    const decode = jwt.verify(token, config.JWT_SECRET);
    // Continue after middleware
    next();
  } catch (err) {
    // Don't continue after middleware, send session message
    req.session.flash = {
      type: 'danger',
      msg: 'Login token has expired'
    };
    // Remove user and token from session
    req.session.user = null;
    req.session.token = null;
    // Check for DELETE request for handling client-side XHR
    return req.method == 'DELETE'
      ? res.status(400).json({ msg: 'Login token has expired' })
      : res.redirect('/');
  }
};

module.exports = auth;
