const connection = require("../connection");

exports.fetchAllTopics = () => {
  return connection.select("slug", "description").from("topics");
};
