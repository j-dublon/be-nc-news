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
    const commentCopy = { ...comment };
    commentCopy.created_at = new Date(commentCopy.created_at);
    commentCopy.author = commentCopy.created_by;
    delete commentCopy.created_by;
    commentCopy.article_id = articleRef[commentCopy.belongs_to];
    delete commentCopy.belongs_to;
    return commentCopy;
  });
  return formattedComments;
};
