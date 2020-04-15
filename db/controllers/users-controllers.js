const { fetchUser } = require("../models/users-models");

exports.sendUser = () => {
  fetchUser();
};
