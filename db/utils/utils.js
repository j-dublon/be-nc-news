exports.formatDates = (list) => {
  return list.map(({ created_at, ...restOfArticle }) => {
    const newList = {
      ...restOfArticle,
      created_at: new Date(created_at),
    };
    return newList;
  });
};

exports.makeRefObj = (list) => {};

exports.formatComments = (comments, articleRef) => {};
