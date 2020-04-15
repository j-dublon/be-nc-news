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
  return connection("articles")
    .where("article_id", "=", given_article_id)
    .returning("*")
    .then((article) => {
      article[0].votes += inc_votes;
      return article[0];
    });
};
