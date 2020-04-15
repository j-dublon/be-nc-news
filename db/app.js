const express = require("express");
const app = express();
const apiRouter = require("../db/routes/api-router");
const { handleInvalidPaths } = require("./errors/index");

app.use(express.json());

app.use("/api", apiRouter);

app.all("/*", handleInvalidPaths);

module.exports = app;
