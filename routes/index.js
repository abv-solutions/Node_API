const express = require('express');
const router = express.Router();
const Article = require('../models/Article');

// Homepage Route
router.get('/', async (req, res) => {
  try {
    const articles = await Article.find({ user_id: req.session.user._id }).sort(
      { updatedAt: -1 }
    );
    res.render('index', {
      title: 'Overview',
      articles
    });
  } catch (err) {
    res.render('index', {
      title: 'Overview'
    });
  }
});

module.exports = router;
