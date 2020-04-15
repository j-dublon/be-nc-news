const express = require("express");
const usersRouter = express.Router();
const { sendUser } = require("../controllers/users-controllers");

usersRouter.get("/:username", sendUser);

module.exports = usersRouter;
