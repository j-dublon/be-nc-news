const express = require("express");
const topicsRouter = express.Router();
const { sendAllTopics } = require("../controllers/topics-controllers");
const { send405Error } = require("../errors/index");

topicsRouter.route("/").get(sendAllTopics).all(send405Error);

module.exports = topicsRouter;
