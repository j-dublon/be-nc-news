const connection = require("../connection");

exports.modifyComment = (comment_id, inc_votes) => {
  if (inc_votes === undefined) {
    return Promise.reject({ status: 400, msg: "bad request" });
  } else {
    return connection("comments")
      .where("comment_id", "=", comment_id)
      .increment("votes", inc_votes)
      .returning("*")
      .then((comment) => {
        if (comment.length === 0) {
          return Promise.reject({ status: 404, msg: "comment not found" });
        } else {
          return comment[0];
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

exports.addArticleComment = (article_id, username, body) => {
  const comment = { author: username, body, article_id };
  if (
    (typeof comment.body !== "string" && comment.body !== undefined) ||
    (typeof comment.username !== "string" && comment.username !== undefined)
  ) {
    return Promise.reject({ status: 400, msg: "invalid data type" });
  } else {
    return connection
      .insert(comment)
      .into("comments")
      .returning("*")
      .then((comment) => {
        return comment[0];
      });
  }
};

exports.fetchArticleComments = (
  article_id,
  sort_by = "created_at",
  order = "desc"
) => {
  if (order !== "asc" && order !== "desc") {
    return Promise.reject({ status: 400, msg: "bad request" });
  } else {
    return connection
      .select(
        "comment_id",
        "votes",
        "created_at",
        "author",
        "body",
        "article_id"
      )
      .from("comments")
      .where("comments.article_id", "=", article_id)
      .orderBy(sort_by, order)
      .then((comments) => {
        if (comments.length === 0) {
          return Promise.reject({ status: 404, msg: "article not found" });
        } else {
          return comments;
        }
      });
  }
};
