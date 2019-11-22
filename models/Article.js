const mongoose = require('mongoose');
const timestamp = require('mongoose-timestamp');

const ArticleSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  author: {
    type: String,
    required: true,
    trim: true
  },
  body: {
    type: String,
    required: true,
    trim: true
  },
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  }
});

ArticleSchema.plugin(timestamp);

const Article = mongoose.model('Article', ArticleSchema);
module.exports = Article;
