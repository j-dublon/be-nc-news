const express = require("express");
const commentsRouter = express.Router();
const { updateComment } = require("../controllers/comments-controller");

commentsRouter.route("/:comment_id").patch(updateComment);

module.exports = commentsRouter;
