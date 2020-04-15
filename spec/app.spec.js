process.env.NODE_ENV = "test";
const app = require("../db/app");
const request = require("supertest");
const connection = require("../db/connection");
const chai = require("chai");
const expect = chai.expect;

describe("app", () => {
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
            .then((res) =>
              res.body.topics.forEach((topic) => {
                expect(topic).to.have.all.keys("slug", "description");
              })
            );
        });
      });
    });
    describe("/api/users/:username", () => {
      describe("GET", () => {
        it("returned user has the correct keys", () => {
          return request(app).get("/api/users/:username").expect(200);
        });
      });
    });
  });
});
