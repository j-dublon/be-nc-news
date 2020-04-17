const fs = require("fs");

exports.sendAvailableEndpoints = (req, res, next) => {
  fs.readFile("./endpoints.json", "utf8", (err, data) => {
    if (err) throw err;
    res.status(200).send({ endpoints: JSON.parse(data) });
  });
};
