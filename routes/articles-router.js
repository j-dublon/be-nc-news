const express = require("express");
const articlesRouter = express.Router();
const {
  sendArticle,
  updateArticle,
  insertArticleComment,
  sendArticleComments,
  sendAllArticles,
  insertArticle,
} = require("../controllers/articles-controllers");
const { send405Error } = require("../errors");

articlesRouter
  .route("/:article_id")
  .get(sendArticle)
  .patch(updateArticle)
  .all(send405Error);

articlesRouter
  .route("/:article_id/comments")
  .post(insertArticleComment)
  .get(sendArticleComments)
  .all(send405Error);

articlesRouter
  .route("/")
  .get(sendAllArticles)
  .post(insertArticle)
  .all(send405Error);

module.exports = articlesRouter;
