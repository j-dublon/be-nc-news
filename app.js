const express = require("express");
const app = express();
const timeout = require('connect-timeout');
const apiRouter = require("./routes/api-router");
const {
  handleInvalidPaths,
  handlePSQLErrors,
  handleCustoms,
  handle500s,
} = require("./errors");
const cors = require("cors");
app.use(cors());

app.use(express.json());

app.use(timeout('10s'))
app.use(haltOnTimedout)

app.use("/api", apiRouter);

app.use(handlePSQLErrors);
app.use(handleCustoms);
app.use(handle500s);
app.all("/*", handleInvalidPaths);

function haltOnTimedout (req, res, next) {
  if (!req.timedout) next()
}

module.exports = app;
