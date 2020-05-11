const {
  fetchArticle,
  modifyArticle,
  fetchAllArticles,
  fetchArticleCount,
  checkAuthorExists,
  checkTopicExists,
  addArticle,
} = require("../models/articles-models");

const {
  addArticleComment,
  fetchArticleComments,
  fetchCommentCount,
  checkArticleExists,
} = require("../models/comments-models");

exports.sendArticle = (req, res, next) => {
  const { article_id } = req.params;
  fetchArticle(article_id)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch(next);
};

exports.updateArticle = (req, res, next) => {
  const { article_id } = req.params;
  const { inc_votes } = req.body;
  modifyArticle(article_id, inc_votes)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch(next);
};

exports.insertArticleComment = (req, res, next) => {
  const { article_id } = req.params;
  const { username, body } = req.body;
  addArticleComment(article_id, username, body)
    .then((comment) => {
      res.status(201).send({ comment });
    })
    .catch(next);
};

exports.sendArticleComments = (req, res, next) => {
  const { article_id } = req.params;
  const { sort_by, order, limit, p } = req.query;
  Promise.all([
    checkArticleExists(article_id),
    fetchArticleComments(article_id, sort_by, order, limit, p),
    fetchCommentCount(article_id),
  ])
    .then(([, comments, total_count]) => {
      res.status(200).send({ comments, total_count });
    })
    .catch(next);
};

exports.sendAllArticles = (req, res, next) => {
  const { sort_by, order, author, topic, limit, p } = req.query;
  Promise.all([
    checkAuthorExists(author),
    checkTopicExists(topic),
    fetchAllArticles(sort_by, order, author, topic, limit, p),
    fetchArticleCount(topic, author),
  ])
    .then(([, , articles, total_count]) => {
      res.status(200).send({ articles, total_count });
    })
    .catch(next);
};

exports.insertArticle = (req, res, next) => {
  const { topic, username, title, body } = req.body;
  Promise.all([
    checkTopicExists(topic),
    addArticle(username, title, body, topic),
  ])
    .then(([, article]) => {
      res.status(201).send({ article });
    })
    .catch(next);
};
