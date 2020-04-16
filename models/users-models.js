const connection = require("../connection");

exports.fetchUser = (username) => {
  return connection("users")
    .where("username", "=", username)
    .then((user) => {
      if (user.length === 0) {
        return Promise.reject({ status: 404, msg: "user not found" });
      } else {
        return user[0];
      }
    });
};
