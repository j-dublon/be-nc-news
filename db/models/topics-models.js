const connection = require("../connection");

exports.fetchAllTopics = () => {
  return connection.select("*").from("topics");
};
