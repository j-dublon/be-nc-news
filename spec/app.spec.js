process.env.NODE_ENV = "test";
const app = require("../db/app");
const request = require("supertest");
const connection = require("../db/connection");
const chai = require("chai");
const expect = chai.expect;

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
      describe.only("PATCH", () => {
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
      });
    });
  });
});
