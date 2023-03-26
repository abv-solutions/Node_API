const express = require('express');
const router = express.Router();
const Article = require('../models/Article');

// Homepage Route
router.get('/', async (req, res) => {
	try {
		const articles = await Article.find({ user_id: req.session.user._id }).sort(
			{ updatedAt: -1 }
		);
		const mappedArticles = articles.map((a) => {
			return {
				_id,
				title,
				body,
				author,
				updatedAt,
			};
		});
		res.render('index', {
			title: 'Overview',
			articles: mappedArticles,
		});
	} catch (err) {
		res.render('index', {
			title: 'Overview',
		});
	}
});

module.exports = router;
