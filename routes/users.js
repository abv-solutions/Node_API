const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('../config/config');
const User = require('../models/User');
const router = express.Router();

// Register new user
router.post('/register', (req, res) => {
  // Validate request format
  if (!req.is('application/x-www-form-urlencoded')) {
    return res.status(400).json({ msg: `Incorrect request format` });
  }
  // Get fields from request body
  const { name, email, password } = req.body;
  const user = new User({
    name,
    email,
    password
  });
  // Validate password
  if (password === '') {
    // Send session message
    req.session.flash = {
      type: 'danger',
      msg: 'Empty fields are not allowed'
    };
    return res.redirect('/');
  }
  // Create salt & hash for password
  bcrypt.genSalt(10, (err0, salt) => {
    if (err0) throw err0;
    bcrypt.hash(user.password, salt, async (err1, hash) => {
      try {
        if (err1) throw err1;
        user.password = hash;
        const newUser = await user.save();
        // Generate token
        jwt.sign(
          { id: newUser._id }, // Payload
          config.JWT_SECRET, // Secret key
          { expiresIn: 60 }, // Sign options
          (err2, token) => {
            if (err2) throw err2;
            // Send session message
            req.session.flash = {
              type: 'success',
              msg: 'You are registered'
            };
            // Save user and token in session
            req.session.user = user;
            req.session.token = token;
            res.redirect('/');
          }
        );
      } catch (err) {
        let msg;
        if (err.message.includes('is required')) {
          // Field validation failed
          msg = 'Empty fields are not allowed';
        } else if (err.message.includes('valid email')) {
          // Email validation failed
          msg = err.errors.email.message;
        } else if (err.message.includes('duplicate key')) {
          // Email already used
          msg = 'User already exists';
        } else {
          // Generic error
          msg = 'Something went wrong';
        }
        // Send session message
        req.session.flash = {
          type: 'danger',
          msg: msg
        };
        res.redirect('/');
      }
    });
  });
});

// Login user
router.post('/', async (req, res) => {
  // Validate request format
  if (!req.is('application/x-www-form-urlencoded')) {
    return res.status(400).json({ msg: `Incorrect request format` });
  }
  // Get fields from request body
  const { email, password } = req.body;
  // Validate fields
  if (email === '' || password === '') {
    // Send session message
    req.session.flash = {
      type: 'danger',
      msg: 'Empty fields are not allowed'
    };
    return res.redirect('/');
  }
  try {
    const user = await User.findOne({ email });
    if (user) {
      // Check password
      bcrypt.compare(password, user.password, (err0, isMatch) => {
        if (err0) throw err0;
        if (isMatch) {
          // Generate token
          jwt.sign(
            { id: user._id }, // Payload
            config.JWT_SECRET, // Secret key
            { expiresIn: 60 }, // Sign options
            (err1, token) => {
              if (err1) throw err1;
              // Send session message
              req.session.flash = {
                type: 'success',
                msg: 'You are logged in'
              };
              // Save user and token in session
              req.session.user = user;
              req.session.token = token;
              res.redirect('/');
            }
          );
        } else {
          // Send session message
          req.session.flash = {
            type: 'danger',
            msg: `Invalid credentials`
          };
          res.redirect('/');
        }
      });
    } else {
      // Send session message
      req.session.flash = {
        type: 'danger',
        msg: `User doesn't exist`
      };
      res.redirect('/');
    }
  } catch (err) {
    // Send session message
    req.session.flash = {
      type: 'danger',
      msg: 'Something went wrong'
    };
    res.redirect('/');
  }
});

// Logout user
router.get('/', (req, res) => {
  // Send session message
  req.session.flash = {
    type: 'success',
    msg: 'You are logged out'
  };
  // Remove user and token from session
  req.session.user = null;
  req.session.token = null;
  res.redirect('/');
});

module.exports = router;
