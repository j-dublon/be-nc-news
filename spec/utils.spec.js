const { expect } = require("chai");
const {
  formatDates,
  makeRefObj,
  formatComments,
} = require("../db/utils/utils");

describe("formatDates", () => {
  it("returns a new empty array when passed an empty array", () => {
    const input = [];
    expect(formatDates(input)).to.deep.equal([]);
    expect(formatDates(input)).to.not.equal(input);
  });
  it("returns object with timestamp converted to javascript date object when passed single object", () => {
    const timestampNow = Date.now();
    const jsTimeNow = new Date(timestampNow);
    const input = [
      {
        title: "Living in the shadow of a great man",
        topic: "mitch",
        author: "butter_bridge",
        body: "I find this existence challenging",
        created_at: timestampNow,
        votes: 100,
      },
    ];
    const result = formatDates(input);
    expect(result[0].created_at).to.deep.equal(jsTimeNow);
  });
  it("returns an array of multiple objects with converted dates", () => {
    const input = [
      {
        title: "Sony Vaio; or, The Laptop",
        topic: "mitch",
        author: "icellusedkars",
        body:
          "Call me Mitchell. Some years ago—never mind how long precisely—having little or no money in my purse, and nothing particular to interest me on shore, I thought I would buy a laptop about a little and see the codey part of the world. It is a way I have of driving off the spleen and regulating the circulation. Whenever I find myself growing grim about the mouth; whenever it is a damp, drizzly November in my soul; whenever I find myself involuntarily pausing before coffin warehouses, and bringing up the rear of every funeral I meet; and especially whenever my hypos get such an upper hand of me, that it requires a strong moral principle to prevent me from deliberately stepping into the street, and methodically knocking people’s hats off—then, I account it high time to get to coding as soon as I can. This is my substitute for pistol and ball. With a philosophical flourish Cato throws himself upon his sword; I quietly take to the laptop. There is nothing surprising in this. If they but knew it, almost all men in their degree, some time or other, cherish very nearly the same feelings towards the the Vaio with me.",
        created_at: 1416140514171,
      },
      {
        title: "Eight pug gifs that remind me of mitch",
        topic: "mitch",
        author: "icellusedkars",
        body: "some gifs",
        created_at: 1289996514171,
      },
    ];
    const result = formatDates(input);
    result.forEach((article) => {
      const jsTime = new Date(article.created_at);
      expect(article.created_at).to.deep.equal(jsTime);
    });
  });
});

describe("makeRefObj", () => {});

describe("formatComments", () => {});
