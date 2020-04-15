const express = require("express");
const topicsRouter = express.Router();
const { sendAllTopics } = require("../controllers/topics-controllers");

topicsRouter.get("/", sendAllTopics);

module.exports = topicsRouter;
