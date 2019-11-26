const express = require('express');
const auth = require('../middleware/auth');
const Article = require('../models/Article');
const router = express.Router();

// Get Single Article
router.get('/:id', auth, async (req, res) => {
  try {
    const article = await Article.findById(req.params.id);
    if (article) {
      if (article.user_id == req.session.user._id) {
        // Valid ID with valid user, show
        res.render('article', {
          title: 'Details',
          article
        });
      } else {
        // Valid ID with invalid user
        res.render('article', {
          title: 'Details',
          msg: 'You are not the author of this article'
        });
      }
    } else {
      // Invalid ID with correct length
      res.render('article', {
        title: 'Details',
        msg: `There is no article with the id of ${req.params.id}`
      });
    }
  } catch (err) {
    let msg;
    if (err.message.includes('failed for value')) {
      // Invalid ID with wrong length
      msg = `There is no article with the id of ${req.params.id}`;
    } else {
      // Generic error
      msg = 'Something went wrong';
    }
    res.render('article', {
      title: 'Details',
      msg
    });
  }
});

// Create Article
router.post('/', auth, async (req, res) => {
  // Validate request format
  if (!req.is('application/x-www-form-urlencoded')) {
    return res.status(400).json({ msg: `Incorrect request format` });
  }
  // Get fields from request body
  const { title, body } = req.body;
  const author = req.session.user.name;
  const user_id = req.session.user._id;
  const article = new Article({
    title,
    author,
    body,
    user_id
  });

  try {
    await article.save();
    // Send session message
    req.session.flash = {
      type: 'success',
      msg: 'Article added'
    };
    res.redirect('/');
  } catch (err) {
    let msg;
    if (err.message.includes('is required')) {
      // Field validation failed
      msg = 'Empty fields are not allowed';
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

// Update Article (forms can't use PUT method)
router.post('/:id', auth, async (req, res) => {
  // Validate request format
  if (!req.is('application/x-www-form-urlencoded')) {
    return res.status(400).json({ msg: `Incorrect request format` });
  }
  // Get fields from request body
  const { title, body } = req.body;
  // Validate fields
  if (title === '' || body === '') {
    // Send session message
    req.session.flash = {
      type: 'danger',
      msg: 'Empty fields are not allowed'
    };
    return res.redirect(`/articles/${req.params.id}`);
  }

  try {
    const article = await Article.findById(req.params.id);
    if (article) {
      if (article.user_id == req.session.user._id) {
        // Valid ID with valid user, update
        await Article.findOneAndUpdate({ _id: article._id }, req.body);
        // Send session message
        req.session.flash = {
          type: 'success',
          msg: 'Article edited'
        };
        res.redirect(`/articles/${article._id}`);
      } else {
        // Valid ID with invalid user, send session message
        req.session.flash = {
          type: 'danger',
          msg: `You are not the author of this article`
        };
        res.redirect(`/articles/${article._id}`);
      }
    } else {
      // Invalid ID with correct length
      res.redirect(`/articles/${article._id}`);
    }
  } catch (err) {
    // Check for invalid ID with wrong length
    if (!err.message.includes('failed for value')) {
      // Generic error, send session message
      req.session.flash = {
        type: 'danger',
        msg: 'Something went wrong'
      };
    }
    res.redirect(`/articles/${req.params.id}`);
  }
});

// Delete Article
router.delete('/:id', auth, async (req, res) => {
  // Validate request format
  if (req.headers.allowed !== 'true') {
    // Send session message
    req.session.flash = {
      type: 'danger',
      msg: 'Incorrect request format'
    };
    // For handling client-side XHR
    return res.status(400).json({ msg: `Incorrect request format` });
  }

  try {
    const article = await Article.findById(req.params.id);
    if (article) {
      if (article.user_id == req.session.user._id) {
        // Valid ID with valid user, delete
        await article.remove();
        // Send session message
        req.session.flash = {
          type: 'success',
          msg: `Article deleted`
        };
        // For handling client-side XHR
        res.status(200).json({ msg: 'Article deleted' });
      } else {
        // Valid ID with invalid user, send session message
        req.session.flash = {
          type: 'danger',
          msg: `You are not the author of this article`
        };
        // For handling client-side XHR
        res.status(401).json({ msg: 'You are not the author of this article' });
      }
    } else {
      // Invalid ID with correct length, send session message
      req.session.flash = {
        type: 'danger',
        msg: `There is no article with the id of ${req.params.id}`
      };
      // For handling client-side XHR
      res
        .status(404)
        .json({ msg: `There is no article with the id of ${req.params.id}` });
    }
  } catch (err) {
    let msg;
    if (err.message.includes('failed for value')) {
      // Invalid ID with wrong length
      msg = `There is no article with the id of ${req.params.id}`;
    } else {
      // Generic error
      msg = 'Something went wrong';
    }
    // Send session message
    req.session.flash = {
      type: 'danger',
      msg: msg
    };
    // For handling client-side XHR
    res.status(404).json({ msg: msg });
  }
});

module.exports = router;
