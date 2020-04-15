const express = require("express");
const articlesRouter = express.Router();
const {
  sendArticle,
  updateArticle,
  insertArticleComment,
} = require("../controllers/articles-controllers");

articlesRouter.route("/:article_id").get(sendArticle).patch(updateArticle);

articlesRouter.route("/:article_id/comments").post(insertArticleComment);

module.exports = articlesRouter;
