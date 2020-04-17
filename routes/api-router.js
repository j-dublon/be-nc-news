const express = require("express");
const apiRouter = express.Router();
const { sendAvailableEndpoints } = require("../controllers/api-controllers");
const { send405Error } = require("../errors");
const topicsRouter = require("./topics-router");
const usersRouter = require("./users-router");
const articlesRouter = require("./articles-router");
const commentsRouter = require("./comments-router");

apiRouter.route("/").get(sendAvailableEndpoints).all(send405Error);

apiRouter.use("/topics", topicsRouter);
apiRouter.use("/users", usersRouter);
apiRouter.use("/articles", articlesRouter);
apiRouter.use("/comments", commentsRouter);

module.exports = apiRouter;
