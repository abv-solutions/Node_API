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
				_id: a._id,
				title: a.title,
				body: a.body,
				author: a.author,
				updatedAt: a.updatedAt,
				user_id: a.user_id,
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
