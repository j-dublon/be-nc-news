const connection = require("../connection");

exports.modifyComment = (comment_id, inc_votes) => {
  if (inc_votes === undefined) {
    return Promise.reject({ status: 400, msg: "bad request" });
  } else {
    return connection("comments")
      .where("comment_id", "=", comment_id)
      .returning("*")
      .then((comment) => {
        if (comment.length === 0) {
          return Promise.reject({ status: 404, msg: "comment not found" });
        } else {
          comment[0].votes += inc_votes;
          if (typeof comment[0].votes !== "number") {
            return Promise.reject({ status: 400, msg: "invalid data type" });
          } else {
            return comment[0];
          }
        }
      });
  }
};

exports.removeComment = (comment_id) => {
  return connection("comments")
    .where("comment_id", "=", comment_id)
    .del()
    .returning("*")
    .then((comment) => {
      if (comment.length === 0) {
        return Promise.reject({ status: 404, msg: "comment not found" });
      }
    });
};
