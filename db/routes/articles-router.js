const express = require("express");
const articlesRouter = express.Router();
const {
  sendArticle,
  updateArticle,
} = require("../controllers/articles-controllers");

articlesRouter.route("/:article_id").get(sendArticle).patch(updateArticle);

module.exports = articlesRouter;
