const connection = require("../connection");

exports.fetchArticle = (given_article_id) => {
  return connection
    .select("articles.*")
    .from("articles")
    .where("articles.article_id", "=", given_article_id)
    .count({ comment_count: "articles.article_id" })
    .leftJoin("comments", "comments.article_id", "articles.article_id")
    .groupBy("articles.article_id")
    .then((article) => {
      if (article.length === 0) {
        return Promise.reject({ status: 404, msg: "article not found" });
      } else {
        return article[0];
      }
    });
};

exports.modifyArticle = (given_article_id, inc_votes) => {
  if (inc_votes === undefined) {
    return Promise.reject({ status: 400, msg: "bad request" });
  } else {
    return connection("articles")
      .where("article_id", "=", given_article_id)
      .increment("votes", inc_votes)
      .returning("*")
      .then((article) => {
        if (article.length === 0) {
          return Promise.reject({ status: 404, msg: "article not found" });
        } else {
          return article[0];
        }
      });
  }
};

exports.fetchAllArticles = (
  sort_by = "created_at",
  order = "desc",
  author,
  topic
) => {
  if (order !== "asc" && order !== "desc") {
    return Promise.reject({ status: 400, msg: "bad request" });
  } else {
    return connection
      .select(
        "articles.author",
        "title",
        "articles.article_id",
        "topic",
        "articles.created_at",
        "articles.votes"
      )
      .from("articles")
      .count({ comment_count: "comments.article_id" })
      .leftJoin("comments", "comments.article_id", "articles.article_id")
      .groupBy("articles.article_id")
      .orderBy(sort_by, order)
      .modify((query) => {
        if (author) query.where("articles.author", author);
      })
      .modify((query) => {
        if (topic) query.where("articles.topic", topic);
      })
      .then((articles) => {
        if (articles.length === 0) {
          return Promise.reject({ status: 404, msg: "articles not found" });
        } else {
          return articles;
        }
      });
  }
};
