const express = require("express");
const app = express();
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

app.use("/api", apiRouter);

app.all("/*", handleInvalidPaths);
app.use(handlePSQLErrors);
app.use(handleCustoms);
app.use(handle500s);

module.exports = app;
