process.env.NODE_ENV = "test";
const app = require("../db/app");
const request = require("supertest");
const connection = require("../db/connection");
const chai = require("chai");
const expect = chai.expect;

describe("app", () => {
  after(() => connection.destroy());
});
