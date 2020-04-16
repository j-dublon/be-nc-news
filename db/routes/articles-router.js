const express = require("express");
const articlesRouter = express.Router();
const {
  sendArticle,
  updateArticle,
  insertArticleComment,
  sendArticleComments,
  sendAllArticles,
} = require("../controllers/articles-controllers");
const { send405Error } = require("../errors/index");

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

articlesRouter.route("/").get(sendAllArticles).all(send405Error);

module.exports = articlesRouter;
