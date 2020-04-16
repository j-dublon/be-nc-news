const express = require("express");
const articlesRouter = express.Router();
const {
  sendArticle,
  updateArticle,
  insertArticleComment,
  sendArticleComments,
  sendAllArticles,
} = require("../controllers/articles-controllers");

articlesRouter.route("/:article_id").get(sendArticle).patch(updateArticle);

articlesRouter
  .route("/:article_id/comments")
  .post(insertArticleComment)
  .get(sendArticleComments);

articlesRouter.route("/").get(sendAllArticles);

module.exports = articlesRouter;
