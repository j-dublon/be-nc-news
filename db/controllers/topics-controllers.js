const { fetchAllTopics } = require("../models/topics-models");

exports.sendAllTopics = (req, res, next) => {
  fetchAllTopics()
    .then((topics) => {
      res.status(200).send({ topics });
    })
    .catch(next);
};
