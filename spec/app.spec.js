process.env.NODE_ENV = "test";
const app = require("../db/app");
const request = require("supertest");
const connection = require("../db/connection");
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
    describe("/api/topics", () => {
      describe("GET", () => {
        it("returned topics should have correct keys", () => {
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
    });
    describe("/api/users/:username", () => {
      describe("GET", () => {
        it("returns the correct user", () => {
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
    });
    describe("/api/articles/:article_id", () => {
      describe("GET", () => {
        it("returned article should have the correct keys", () => {
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
        it("returned article has accurate comment_count", () => {
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
        it("status: 404 not found if given valid but non-existent article_id", () => {
          return request(app)
            .get("/api/articles/9999999")
            .expect(404)
            .then(({ body: { msg } }) => {
              expect(msg).to.equal("article not found");
            });
        });
        it("status: 400 bad request if given invalid article_id", () => {
          return request(app)
            .get("/api/articles/not-id")
            .expect(400)
            .then(({ body: { msg } }) => {
              expect(msg).to.equal("invalid data type");
            });
        });
      });
      describe("PATCH", () => {
        it("status: 200 updates the votes property and responds with the updated article", () => {
          return request(app)
            .patch("/api/articles/1")
            .send({ inc_votes: 5 })
            .expect(200)
            .then((res) => {
              expect(res.body).to.deep.equal({
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
        it("status: 404 not found if given valid but non-existent article_id", () => {
          return request(app)
            .patch("/api/articles/9999999")
            .send({ inc_votes: 5 })
            .expect(404)
            .then(({ body: { msg } }) => {
              expect(msg).to.equal("article not found");
            });
        });
        it("status: 400 bad request if given invalid article_id", () => {
          return request(app)
            .patch("/api/articles/not-id")
            .send({ inc_votes: 5 })
            .expect(400)
            .then(({ body: { msg } }) => {
              expect(msg).to.equal("invalid data type");
            });
        });
        it("status: 400 for invalid property given", () => {
          return request(app)
            .patch("/api/articles/1")
            .send({ bananas: 10 })
            .expect(400)
            .then((response) => {
              expect(response.body.msg).to.equal("bad request");
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
        it("status: 404 not found if given valid but non-existent article_id", () => {
          return request(app)
            .post("/api/articles/9999999/comments")
            .send({ username: "rogersop", body: "this is amazing" })
            .expect(404)
            .then(({ body: { msg } }) => {
              expect(msg).to.equal("article not found");
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
      describe.only("GET", () => {
        it("should return all comments associated with an article", () => {
          return request(app)
            .get("/api/articles/1/comments")
            .expect(200)
            .then(({ body: { comments } }) => {
              expect(comments.length).to.equal(13);
            });
        });
        it("returned comments should have the correct properties", () => {
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
        it("accepts a query to sort by any valid column", () => {
          return request(app)
            .get("/api/articles/5/comments?sort_by=votes")
            .expect(200)
            .then(({ body: { comments } }) => {
              expect(comments).to.be.sortedBy("votes", { descending: true });
            });
        });
        it("default sort_by is created_at", () => {
          return request(app)
            .get("/api/articles/5/comments")
            .expect(200)
            .then(({ body: { comments } }) => {
              expect(comments).to.be.sortedBy("created_at", {
                descending: true,
              });
            });
        });
        it("accepts a query to order by either ascending or descending", () => {
          return request(app)
            .get("/api/articles/5/comments?order=asc")
            .expect(200)
            .then(({ body: { comments } }) => {
              expect(comments).to.be.ascendingBy("created_at");
            });
        });
        it("default order is descending", () => {
          return request(app)
            .get("/api/articles/5/comments")
            .expect(200)
            .then(({ body: { comments } }) => {
              expect(comments).to.be.descendingBy("created_at");
            });
        });
        it("status: 404 not found if given valid but non-existent article_id", () => {
          return request(app)
            .get("/api/articles/9999999/comments")
            .expect(404)
            .then(({ body: { msg } }) => {
              expect(msg).to.equal("article not found");
            });
        });
        it("status: 400 bad request if given invalid article_id", () => {
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
      });
    });
  });
});
