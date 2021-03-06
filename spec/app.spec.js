process.env.NODE_ENV = "test";
const app = require("../app");
const request = require("supertest");
const connection = require("../connection");
const chai = require("chai");
const expect = chai.expect;
chai.use(require("chai-sorted"));

describe("app", () => {
  beforeEach(() => connection.seed.run());
  after(() => connection.destroy());
  it("status: 404 for invalid path", () => {
    return request(app)
      .get("/invalid-path")
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).to.equal("path not found");
      });
  });
  describe("/api", () => {
    describe("GET", () => {
      it("status 200: responds with a json of all available endpoints on this API", () => {
        return request(app)
          .get("/api")
          .expect(200)
          .expect("Content-Type", /json/);
      });
      it("status: 405 for invalid methods", () => {
        const invalidMethods = ["patch", "post", "delete"];
        const methodPromises = invalidMethods.map((method) => {
          return request(app)
            [method]("/api")
            .expect(405)
            .then(({ body: { msg } }) => {
              expect(msg).to.equal("method not allowed");
            });
        });
        return Promise.all(methodPromises);
      });
    });
    describe("/api/topics", () => {
      describe("GET", () => {
        it("status: 200 returned topics should have correct keys", () => {
          return request(app)
            .get("/api/topics")
            .expect(200)
            .then(({ body: { topics } }) =>
              topics.forEach((topic) => {
                expect(topic).to.have.all.keys("slug", "description");
              })
            );
        });
      });
      describe("invalid methods", () => {
        it("status: 405 for invalid methods", () => {
          const invalidMethods = ["patch", "post", "delete"];
          const methodPromises = invalidMethods.map((method) => {
            return request(app)
              [method]("/api/topics")
              .expect(405)
              .then(({ body: { msg } }) => {
                expect(msg).to.equal("method not allowed");
              });
          });
          return Promise.all(methodPromises);
        });
      });
    });
    describe("/api/users/:username", () => {
      describe("GET", () => {
        it("status: 200 returns the correct user", () => {
          return request(app)
            .get("/api/users/butter_bridge")
            .expect(200)
            .then((res) => {
              expect(res.body).to.deep.equal({
                user: {
                  username: "butter_bridge",
                  name: "jonny",
                  avatar_url:
                    "https://www.healthytherapies.com/wp-content/uploads/2016/06/Lime3.jpg",
                },
              });
            });
        });
        it("status: 404 for non-existent user name", () => {
          return request(app)
            .get("/api/users/not_a_user")
            .expect(404)
            .then(({ body: { msg } }) => {
              expect(msg).to.equal("user not found");
            });
        });
      });
      describe("invalid methods", () => {
        it("status: 405 for invalid methods", () => {
          const invalidMethods = ["patch", "post", "delete"];
          const methodPromises = invalidMethods.map((method) => {
            return request(app)
              [method]("/api/users/butter_bridge")
              .expect(405)
              .then(({ body: { msg } }) => {
                expect(msg).to.equal("method not allowed");
              });
          });
          return Promise.all(methodPromises);
        });
      });
    });
    describe("/api/articles/:article_id", () => {
      describe("GET", () => {
        it("status: 200 returned article should have the correct keys", () => {
          return request(app)
            .get("/api/articles/1")
            .expect(200)
            .then(({ body: { article } }) => {
              expect(article).to.have.all.keys(
                "author",
                "title",
                "article_id",
                "body",
                "topic",
                "created_at",
                "votes",
                "comment_count"
              );
            });
        });
        it("status: 200 returned article has accurate comment_count", () => {
          return request(app)
            .get("/api/articles/1")
            .expect(200)
            .then(
              ({
                body: {
                  article: { comment_count },
                },
              }) => {
                expect(comment_count).to.equal("13");
              }
            );
        });
        it("status: 404 if given valid but non-existent article_id", () => {
          return request(app)
            .get("/api/articles/9999999")
            .expect(404)
            .then(({ body: { msg } }) => {
              expect(msg).to.equal("article not found");
            });
        });
        it("status: 400 if given invalid article_id", () => {
          return request(app)
            .get("/api/articles/not-id")
            .expect(400)
            .then(({ body: { msg } }) => {
              expect(msg).to.equal("invalid data type");
            });
        });
      });
      describe("PATCH", () => {
        it("status: 200 updates an article's votes property and responds with the updated article", () => {
          return request(app)
            .patch("/api/articles/1")
            .send({ inc_votes: 5 })
            .expect(200)
            .then(({ body }) => {
              expect(body).to.deep.equal({
                article: {
                  article_id: 1,
                  title: "Living in the shadow of a great man",
                  body: "I find this existence challenging",
                  votes: 105,
                  topic: "mitch",
                  author: "butter_bridge",
                  created_at: "2018-11-15T12:21:54.171Z",
                },
              });
            });
        });
        it("status: 200 ignores a patch request with an empty request body and responds with unchanged article", () => {
          return request(app)
            .patch("/api/articles/1")
            .send({})
            .expect(200)
            .then(({ body }) => {
              expect(body).to.deep.equal({
                article: {
                  article_id: 1,
                  title: "Living in the shadow of a great man",
                  body: "I find this existence challenging",
                  votes: 100,
                  topic: "mitch",
                  author: "butter_bridge",
                  created_at: "2018-11-15T12:21:54.171Z",
                },
              });
            });
        });
        it("status: 404 if given valid but non-existent article_id", () => {
          return request(app)
            .patch("/api/articles/9999999")
            .send({ inc_votes: 5 })
            .expect(404)
            .then(({ body: { msg } }) => {
              expect(msg).to.equal("article not found");
            });
        });
        it("status: 400 if given invalid article_id", () => {
          return request(app)
            .patch("/api/articles/not-id")
            .send({ inc_votes: 5 })
            .expect(400)
            .then(({ body: { msg } }) => {
              expect(msg).to.equal("invalid data type");
            });
        });
        it("status: 400 invalid data type given for inc_votes", () => {
          return request(app)
            .patch("/api/articles/1")
            .send({ inc_votes: "five" })
            .expect(400)
            .then((response) => {
              expect(response.body.msg).to.equal("invalid data type");
            });
        });
      });
      describe("DELETE", () => {
        it("status: 204 deletes an article by id", () => {
          return request(app)
            .del("/api/articles/2")
            .expect(204)
            .then(() => {
              return connection("articles").where({ article_id: 2 });
            })
            .then((article) => {
              expect(article.length).to.equal(0);
            });
        });
        it("status: 404 if given valid but non-existent article_id", () => {
          return request(app)
            .del("/api/articles/9999999")
            .expect(404)
            .then(({ body: { msg } }) => {
              expect(msg).to.equal("article not found");
            });
        });
        it("status: 400 if given invalid article_id", () => {
          return request(app)
            .del("/api/articles/not-id")
            .expect(400)
            .then(({ body: { msg } }) => {
              expect(msg).to.equal("invalid data type");
            });
        });
      });
      describe("invalid methods", () => {
        it("status: 405 for invalid methods", () => {
          return request(app)
            .post("/api/articles/1")
            .expect(405)
            .then(({ body: { msg } }) => {
              expect(msg).to.equal("method not allowed");
            });
        });
      });
    });
    describe("/api/articles/:article_id/comments", () => {
      describe("POST", () => {
        it("status: 201 inserts a new comment on an article and responds with the comment object", () => {
          return request(app)
            .post("/api/articles/2/comments")
            .send({ username: "rogersop", body: "this is amazing" })
            .expect(201)
            .then(({ body: { comment } }) => {
              expect(comment).to.have.all.keys(
                "comment_id",
                "author",
                "article_id",
                "votes",
                "created_at",
                "body"
              );
            });
        });
        it("status: 404 if given valid but non-existent article_id", () => {
          return request(app)
            .post("/api/articles/9999999/comments")
            .send({ username: "rogersop", body: "this is amazing" })
            .expect(404)
            .then(({ body: { msg } }) => {
              expect(msg).to.equal("item not found");
            });
        });
        it("status: 400 if given invalid article_id", () => {
          return request(app)
            .post("/api/articles/not-id/comments")
            .send({ username: "rogersop", body: "this is amazing" })
            .expect(400)
            .then(({ body: { msg } }) => {
              expect(msg).to.equal("invalid data type");
            });
        });
        it("status: 400 if missing a non-nullable key", () => {
          return request(app)
            .post("/api/articles/2/comments")
            .send({ body: "this is amazing" })
            .expect(400)
            .then(({ body: { msg } }) => {
              expect(msg).to.equal("missing property");
            });
        });
        it("status: 400 invalid data type provided", () => {
          return request(app)
            .post("/api/articles/2/comments")
            .send({ username: "rogersop", body: 567 })
            .expect(400)
            .then(({ body: { msg } }) => {
              expect(msg).to.equal("invalid data type");
            });
        });
      });
      describe("GET", () => {
        it("status: 200 should return all comments associated with an article (up to default limit 10)", () => {
          return request(app)
            .get("/api/articles/1/comments")
            .expect(200)
            .then(({ body: { comments } }) => {
              expect(comments.length).to.equal(10);
            });
        });
        it("status: 200 responds with empty array when article exists but has no comments", () => {
          return request(app)
            .get("/api/articles/12/comments")
            .expect(200)
            .then(({ body: { comments } }) => {
              expect(comments.length).to.equal(0);
            });
        });
        it("status: 200 returned comments should have the correct properties", () => {
          return request(app)
            .get("/api/articles/1/comments")
            .expect(200)
            .then(({ body: { comments } }) => {
              comments.forEach((comment) => {
                expect(comment).to.have.all.keys(
                  "article_id",
                  "comment_id",
                  "votes",
                  "created_at",
                  "author",
                  "body"
                );
              });
            });
        });
        it("status: 200 accepts a query to sort by any valid column", () => {
          return request(app)
            .get("/api/articles/5/comments?sort_by=votes")
            .expect(200)
            .then(({ body: { comments } }) => {
              expect(comments).to.be.sortedBy("votes", { descending: true });
            });
        });
        it("status: 200 default sort_by is created_at", () => {
          return request(app)
            .get("/api/articles/5/comments")
            .expect(200)
            .then(({ body: { comments } }) => {
              expect(comments).to.be.sortedBy("created_at", {
                descending: true,
              });
            });
        });
        it("status: 200 accepts a query to order ascending", () => {
          return request(app)
            .get("/api/articles/5/comments?order=asc")
            .expect(200)
            .then(({ body: { comments } }) => {
              expect(comments).to.be.ascendingBy("created_at");
            });
        });
        it("status: 200 default order is descending", () => {
          return request(app)
            .get("/api/articles/5/comments")
            .expect(200)
            .then(({ body: { comments } }) => {
              expect(comments).to.be.descendingBy("created_at");
            });
        });
        it("status: 200 accepts a limit query and responds with specified number of comments", () => {
          return request(app)
            .get("/api/articles/1/comments?limit=3")
            .expect(200)
            .then(({ body: { comments } }) => {
              expect(comments.length).to.equal(3);
            });
        });
        it("status: 200 responds with a default limit of 10 comments", () => {
          return request(app)
            .get("/api/articles/1/comments")
            .expect(200)
            .then(({ body: { comments } }) => {
              expect(comments.length).to.equal(10);
            });
        });
        it("status: 200 accepts a page query to view comments by which page of results they appear on", () => {
          return request(app)
            .get("/api/articles/1/comments?sort_by=comment_id&p=2")
            .expect(200)
            .then(({ body: { comments } }) => {
              expect(comments.length).to.equal(3);
              expect(comments[2].comment_id).to.equal(2);
            });
        });
        it("status: 200 returns a total_count of comments disregarding default limit", () => {
          return request(app)
            .get("/api/articles/1/comments")
            .expect(200)
            .then(({ body: { total_count } }) => {
              expect(total_count).to.equal(13);
            });
        });
        it("status: 404 if given valid but non-existent article_id", () => {
          return request(app)
            .get("/api/articles/9999999/comments")
            .expect(404)
            .then(({ body: { msg } }) => {
              expect(msg).to.equal("article not found");
            });
        });
        it("status: 400 if given invalid article_id", () => {
          return request(app)
            .get("/api/articles/not-id/comments")
            .expect(400)
            .then(({ body: { msg } }) => {
              expect(msg).to.equal("invalid data type");
            });
        });
        it("status: 400 for an invalid sort by query", () => {
          return request(app)
            .get("/api/articles/1/comments?sort_by=banana")
            .expect(400)
            .then(({ body: { msg } }) => {
              expect(msg).to.equal("bad request");
            });
        });
        it("status: 400 for an invalid order query", () => {
          return request(app)
            .get("/api/articles/1/comments?order=sideways")
            .expect(400)
            .then(({ body: { msg } }) => {
              expect(msg).to.equal("bad request");
            });
        });
        it("status: 400 for an invalid limit query", () => {
          return request(app)
            .get("/api/articles/1/comments?limit=thirty3")
            .expect(400)
            .then(({ body: { msg } }) => {
              expect(msg).to.equal("bad request");
            });
        });
        it("status: 400 for an invalid page query", () => {
          return request(app)
            .get("/api/articles/1/comments?sort_by=comment_id&p=two")
            .expect(400)
            .then(({ body: { msg } }) => {
              expect(msg).to.equal("bad request");
            });
        });
      });
      describe("invalid methods", () => {
        it("status: 405 for invalid methods", () => {
          const invalidMethods = ["patch", "delete"];
          const methodPromises = invalidMethods.map((method) => {
            return request(app)
              [method]("/api/articles/1/comments")
              .expect(405)
              .then(({ body: { msg } }) => {
                expect(msg).to.equal("method not allowed");
              });
          });
          return Promise.all(methodPromises);
        });
      });
    });
    describe("/api/articles", () => {
      describe("GET", () => {
        it("status: 200 returned articles have the correct keys", () => {
          return request(app)
            .get("/api/articles")
            .expect(200)
            .then(({ body: { articles } }) => {
              expect(articles.length).to.equal(9);
              articles.forEach((article) => {
                expect(article).to.have.all.keys(
                  "author",
                  "title",
                  "article_id",
                  "topic",
                  "created_at",
                  "votes",
                  "comment_count"
                );
              });
            });
        });
        it("status: 200 returns a total_count of articles disregarding default limit", () => {
          return request(app)
            .get("/api/articles")
            .expect(200)
            .then(({ body: { total_count } }) => {
              expect(total_count).to.equal(12);
            });
        });
        it("status: 200 accepts a query to sort by any valid column", () => {
          return request(app)
            .get("/api/articles?sort_by=votes")
            .expect(200)
            .then(({ body: { articles } }) => {
              expect(articles).to.be.sortedBy("votes", { descending: true });
            });
        });
        it("status: 200 default sort_by is created_at", () => {
          return request(app)
            .get("/api/articles")
            .expect(200)
            .then(({ body: { articles } }) => {
              expect(articles).to.be.sortedBy("created_at", {
                descending: true,
              });
            });
        });
        it("status: 200 accepts a query to order ascending", () => {
          return request(app)
            .get("/api/articles?order=asc")
            .expect(200)
            .then(({ body: { articles } }) => {
              expect(articles).to.be.ascendingBy("created_at");
            });
        });
        it("status: 200 default order is descending", () => {
          return request(app)
            .get("/api/articles")
            .expect(200)
            .then(({ body: { articles } }) => {
              expect(articles).to.be.descendingBy("created_at");
            });
        });
        it("status: 200 accepts a query to filter articles by specified author", () => {
          return request(app)
            .get("/api/articles?author=rogersop")
            .expect(200)
            .then(({ body: { articles } }) => {
              articles.forEach((article) => {
                expect(article.author).to.equal("rogersop");
              });
            });
        });
        it("status: 200 accepts a query to filter articles by specified topic", () => {
          return request(app)
            .get("/api/articles?topic=cats")
            .expect(200)
            .then(({ body: { articles } }) => {
              articles.forEach((article) => {
                expect(article.topic).to.equal("cats");
              });
            });
        });
        it("status: 200 responds with empty array when specified author has no associated articles", () => {
          return request(app)
            .get("/api/articles?author=lurker")
            .expect(200)
            .then(({ body: { articles } }) => {
              expect(articles.length).to.equal(0);
            });
        });
        it("status: 200 responds with empty array when specified topic has no associated articles", () => {
          return request(app)
            .get("/api/articles?topic=paper")
            .expect(200)
            .then(({ body: { articles } }) => {
              expect(articles.length).to.equal(0);
            });
        });
        it("status: 200 accepts a limit query and responds with specified number of articles", () => {
          return request(app)
            .get("/api/articles?limit=3")
            .expect(200)
            .then(({ body: { articles } }) => {
              expect(articles.length).to.equal(3);
            });
        });
        it("status: 200 responds with a default limit of 9 articles", () => {
          return request(app)
            .get("/api/articles")
            .expect(200)
            .then(({ body: { articles } }) => {
              expect(articles.length).to.equal(9);
            });
        });
        it("status: 200 accepts a page query to view articles by which page of results they appear on", () => {
          return request(app)
            .get("/api/articles?sort_by=article_id&p=2")
            .expect(200)
            .then(({ body: { articles } }) => {
              expect(articles.length).to.equal(3);
              expect(articles[1].article_id).to.equal(2);
            });
        });
        it("status: 400 for an invalid sort_by query", () => {
          return request(app)
            .get("/api/articles?sort_by=banana")
            .expect(400)
            .then(({ body: { msg } }) => {
              expect(msg).to.equal("bad request");
            });
        });
        it("status: 400 for an invalid order query", () => {
          return request(app)
            .get("/api/articles?order=sideways")
            .expect(400)
            .then(({ body: { msg } }) => {
              expect(msg).to.equal("bad request");
            });
        });
        it("status: 400 for an invalid limit query", () => {
          return request(app)
            .get("/api/articles?limit=ten15")
            .expect(400)
            .then(({ body: { msg } }) => {
              expect(msg).to.equal("bad request");
            });
        });
        it("status: 400 for an invalid page query", () => {
          return request(app)
            .get("/api/articles?p=two")
            .expect(400)
            .then(({ body: { msg } }) => {
              expect(msg).to.equal("bad request");
            });
        });
        it("status: 404 for filter by non-existent author request", () => {
          return request(app)
            .get("/api/articles?author=nobody")
            .expect(404)
            .then(({ body: { msg } }) => {
              expect(msg).to.equal("author does not exist");
            });
        });
        it("status: 404 for filter by non-existent topic request", () => {
          return request(app)
            .get("/api/articles?topic=nothing")
            .expect(404)
            .then(({ body: { msg } }) => {
              expect(msg).to.equal("topic does not exist");
            });
        });
      });
      describe("POST", () => {
        it("status: 201 inserts a new article and responds with the article object", () => {
          return request(app)
            .post("/api/articles")
            .send({
              username: "rogersop",
              title: "some article",
              body: "some info",
              topic: "mitch",
            })
            .expect(201)
            .then(({ body: { article } }) => {
              expect(article).to.have.all.keys(
                "author",
                "title",
                "article_id",
                "topic",
                "created_at",
                "votes",
                "body"
              );
            });
        });
        it("status: 400 if article is posted to non-existent topic", () => {
          return request(app)
            .post("/api/articles")
            .send({
              username: "rogersop",
              title: "some article",
              body: "some info",
              topic: "transylvania",
            })
            .expect(404)
            .then(({ body: { msg } }) => {
              expect(msg).to.equal("topic does not exist");
            });
        });
        it("status: 400 invalid data type provided", () => {
          return request(app)
            .post("/api/articles")
            .send({
              username: 384,
              title: "some article",
              body: "some info",
              topic: "mitch",
            })
            .expect(400)
            .then(({ body: { msg } }) => {
              expect(msg).to.equal("invalid data type");
            });
        });
        it("status: 400 if missing a non-nullable key", () => {
          return request(app)
            .post("/api/articles")
            .send({
              username: "rogersop",
              body: "some info",
              topic: "mitch",
            })
            .expect(400)
            .then(({ body: { msg } }) => {
              expect(msg).to.equal("missing property");
            });
        });
      });
      describe("invalid methods", () => {
        it("status: 405 for invalid methods", () => {
          const invalidMethods = ["patch", "delete"];
          const methodPromises = invalidMethods.map((method) => {
            return request(app)
              [method]("/api/articles")
              .expect(405)
              .then(({ body: { msg } }) => {
                expect(msg).to.equal("method not allowed");
              });
          });
          return Promise.all(methodPromises);
        });
      });
    });
    describe("/api/comments/:comment_id", () => {
      describe("PATCH", () => {
        it("status: 200 updates a comment's votes property and returns the comment object", () => {
          return request(app)
            .patch("/api/comments/1")
            .send({ inc_votes: -5 })
            .expect(200)
            .then(({ body }) => {
              expect(body).to.deep.equal({
                comment: {
                  comment_id: 1,
                  author: "butter_bridge",
                  article_id: 9,
                  votes: 11,
                  created_at: "2017-11-22T12:36:03.389Z",
                  body:
                    "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
                },
              });
            });
        });
        it("status: 200 ignores a patch request with an empty request body and responds with unchanged comment", () => {
          return request(app)
            .patch("/api/comments/1")
            .send({})
            .expect(200)
            .then(({ body }) => {
              expect(body).to.deep.equal({
                comment: {
                  comment_id: 1,
                  author: "butter_bridge",
                  article_id: 9,
                  votes: 16,
                  created_at: "2017-11-22T12:36:03.389Z",
                  body:
                    "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
                },
              });
            });
        });
        it("status: 404 if given valid but non-existent comment_id", () => {
          return request(app)
            .patch("/api/comments/9999999")
            .send({ inc_votes: 5 })
            .expect(404)
            .then(({ body: { msg } }) => {
              expect(msg).to.equal("comment not found");
            });
        });
        it("status: 400 if given invalid comment_id", () => {
          return request(app)
            .patch("/api/comments/not-id")
            .send({ inc_votes: 5 })
            .expect(400)
            .then(({ body: { msg } }) => {
              expect(msg).to.equal("invalid data type");
            });
        });
        it("status: 400 invalid data type given for inc_votes", () => {
          return request(app)
            .patch("/api/comments/1")
            .send({ inc_votes: "five" })
            .expect(400)
            .then((response) => {
              expect(response.body.msg).to.equal("invalid data type");
            });
        });
      });
      describe("DELETE", () => {
        it("status: 204 deletes a comment by id", () => {
          return request(app)
            .del("/api/comments/1")
            .expect(204)
            .then(() => {
              return connection("comments").where({ comment_id: 1 });
            })
            .then((comment) => {
              expect(comment.length).to.equal(0);
            });
        });
        it("status: 404 if given valid but non-existent comment_id", () => {
          return request(app)
            .del("/api/comments/9999999")
            .expect(404)
            .then(({ body: { msg } }) => {
              expect(msg).to.equal("comment not found");
            });
        });
        it("status: 400 if given invalid comment_id", () => {
          return request(app)
            .del("/api/comments/not-id")
            .expect(400)
            .then(({ body: { msg } }) => {
              expect(msg).to.equal("invalid data type");
            });
        });
      });
      describe("invalid methods", () => {
        it("status: 405 for invalid methods", () => {
          const invalidMethods = ["post", "get"];
          const methodPromises = invalidMethods.map((method) => {
            return request(app)
              [method]("/api/comments/:comment_id")
              .expect(405)
              .then(({ body: { msg } }) => {
                expect(msg).to.equal("method not allowed");
              });
          });
          return Promise.all(methodPromises);
        });
      });
    });
  });
});
