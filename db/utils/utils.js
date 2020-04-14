exports.formatDates = (list) => {
  return list.map(({ created_at, ...restOfArticle }) => {
    const newList = {
      ...restOfArticle,
      created_at: new Date(created_at),
    };
    return newList;
  });
};

exports.makeRefObj = (list) => {
  const articleRef = {};
  list.forEach((article) => {
    articleRef[article.title] = article.article_id;
  });
  return articleRef;
};

exports.formatComments = (comments, articleRef) => {
  const formattedComments = comments.map((comment) => {
    comment.created_at = new Date(comment.created_at);
    comment.author = comment.created_by;
    delete comment.created_by;
    comment.article_id = articleRef[comment.belongs_to];
    delete comment.belongs_to;
    return comment;
  });
  return formattedComments;
};
