exports.handleInvalidPaths = (req, res, next) => {
  res.status(404).send({ msg: "path not found" });
};

exports.handleCustoms = (err, req, res, next) => {
  if (err.status) res.status(err.status).send({ msg: err.msg });
};

exports.handle500s = (err, req, res, next) => {
  console.log(err);
  res.status(500).send({ msg: "server error" });
};
