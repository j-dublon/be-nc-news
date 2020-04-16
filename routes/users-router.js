const express = require("express");
const usersRouter = express.Router();
const { sendUser } = require("../controllers/users-controllers");
const { send405Error } = require("../errors");

usersRouter.route("/:username").get(sendUser).all(send405Error);

module.exports = usersRouter;
