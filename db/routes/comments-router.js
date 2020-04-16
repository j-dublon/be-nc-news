const express = require("express");
const commentsRouter = express.Router();
const {
  updateComment,
  deleteComment,
} = require("../controllers/comments-controller");
const { send405Error } = require("../errors/index");

commentsRouter
  .route("/:comment_id")
  .patch(updateComment)
  .delete(deleteComment)
  .all(send405Error);

module.exports = commentsRouter;
