const connection = require("../connection");

exports.modifyComment = (comment_id, inc_votes = 0) => {
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
  order = "desc",
  limit = "10",
  page = "1"
) => {
  if (
    (order !== "asc" && order !== "desc") ||
    limit.match(/^[0-9]+$/) === null ||
    page.match(/^[0-9]+$/) === null
  ) {
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
      .modify((query) => {
        if (limit) query.limit(limit);
      })
      .modify((query) => {
        if (page) query.limit(limit).offset((page - 1) * 10);
      });
  }
};

exports.fetchCommentCount = (article_id) => {
  return connection("comments")
    .where("article_id", "=", article_id)
    .count({ comment_count: "comment_id" })
    .then((count) => {
      const total_count = Number(count[0].comment_count);
      return total_count;
    });
};

exports.checkArticleExists = (article_id) => {
  return connection
    .select("body")
    .from("articles")
    .where("articles.article_id", "=", article_id)
    .then((articles) => {
      if (articles.length === 0) {
        return Promise.reject({ status: 404, msg: "article not found" });
      }
    });
};
