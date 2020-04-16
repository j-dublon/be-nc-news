exports.handleInvalidPaths = (req, res, next) => {
  res.status(404).send({ msg: "path not found" });
};

exports.handlePSQLErrors = (err, req, res, next) => {
  const codes = {
    "22P02": { status: 400, msg: "invalid data type" },
    23503: { status: 404, msg: "article not found" },
    23502: { status: 400, msg: "missing property" },
    42703: { status: 400, msg: "bad request" },
  };
  if (err.code in codes) {
    const { status, msg } = codes[err.code];
    res.status(status).send({ msg });
  }
  next(err);
};

exports.handleCustoms = (err, req, res, next) => {
  if (err.status) res.status(err.status).send({ msg: err.msg });
  else next(err);
};

exports.handle500s = (err, req, res, next) => {
  console.log(err);
  res.status(500).send({ msg: "server error" });
};
