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

describe("makeRefObj", () => {
  it("returns an empty object when passed an empty array", () => {
    expect(makeRefObj([])).to.deep.equal({});
  });
  it("returns an object with title and article_id when passed single item array", () => {
    const input = [
      {
        title: "Living in the shadow of a great man",
        topic: "mitch",
        author: "butter_bridge",
        body: "I find this existence challenging",
        created_at: 1542284514171,
        votes: 100,
        article_id: 1,
      },
    ];
    const expected = { "Living in the shadow of a great man": 1 };
    expect(makeRefObj(input)).to.deep.equal(expected);
  });
  it("returns reference object with multiple references when passed an array of articles", () => {
    const input = [
      {
        title: "Sony Vaio; or, The Laptop",
        topic: "mitch",
        author: "icellusedkars",
        body:
          "Call me Mitchell. Some years ago—never mind how long precisely—having little or no money in my purse, and nothing particular to interest me on shore, I thought I would buy a laptop about a little and see the codey part of the world. It is a way I have of driving off the spleen and regulating the circulation. Whenever I find myself growing grim about the mouth; whenever it is a damp, drizzly November in my soul; whenever I find myself involuntarily pausing before coffin warehouses, and bringing up the rear of every funeral I meet; and especially whenever my hypos get such an upper hand of me, that it requires a strong moral principle to prevent me from deliberately stepping into the street, and methodically knocking people’s hats off—then, I account it high time to get to coding as soon as I can. This is my substitute for pistol and ball. With a philosophical flourish Cato throws himself upon his sword; I quietly take to the laptop. There is nothing surprising in this. If they but knew it, almost all men in their degree, some time or other, cherish very nearly the same feelings towards the the Vaio with me.",
        created_at: 1416140514171,
        article_id: 2,
      },
      {
        title: "Eight pug gifs that remind me of mitch",
        topic: "mitch",
        author: "icellusedkars",
        body: "some gifs",
        created_at: 1289996514171,
        article_id: 3,
      },
    ];
    const expected = {
      "Sony Vaio; or, The Laptop": 2,
      "Eight pug gifs that remind me of mitch": 3,
    };
    expect(makeRefObj(input)).to.deep.equal(expected);
  });
});

describe("formatComments", () => {
  it("should return a new empty array when passed an empty array", () => {
    const comments = [];
    const articleRef = {};
    expect(formatComments(comments, articleRef)).to.deep.equal([]);
    expect(formatComments(comments, articleRef)).to.not.equal(comments);
  });
  it("returns one correctly formatted comment when passed a single comment", () => {
    const comments = [
      {
        body:
          "The beautiful thing about treasure is that it exists. Got to find out what kind of sheets these are; not cotton, not rayon, silky.",
        belongs_to: "Living in the shadow of a great man",
        created_by: "butter_bridge",
        votes: 14,
        created_at: 1479818163389,
      },
    ];
    const articleRef = { "Living in the shadow of a great man": 1 };
    const jsTime = new Date(1479818163389);
    const expected = [
      {
        body:
          "The beautiful thing about treasure is that it exists. Got to find out what kind of sheets these are; not cotton, not rayon, silky.",
        article_id: 1,
        author: "butter_bridge",
        votes: 14,
        created_at: jsTime,
      },
    ];
    expect(formatComments(comments, articleRef)).to.deep.equal(expected);
  });
  it("returns multiple correctly formatted comments", () => {
    const comments = [
      {
        body:
          "Replacing the quiet elegance of the dark suit and tie with the casual indifference of these muted earth tones is a form of fashion suicide, but, uh, call me crazy — onyou it works.",
        belongs_to: "Living in the shadow of a great man",
        created_by: "icellusedkars",
        votes: 100,
        created_at: 1448282163389,
      },
      {
        body: "The owls are not what they seem.",
        belongs_to: "They're not exactly dogs, are they?",
        created_by: "icellusedkars",
        votes: 20,
        created_at: 1006778163389,
      },
    ];
    const articleRef = {
      "Living in the shadow of a great man": 1,
      "They're not exactly dogs, are they?": 3,
    };
    const jsTime1 = new Date(1448282163389);
    const jsTime2 = new Date(1006778163389);
    const expected = [
      {
        body:
          "Replacing the quiet elegance of the dark suit and tie with the casual indifference of these muted earth tones is a form of fashion suicide, but, uh, call me crazy — onyou it works.",
        article_id: 1,
        author: "icellusedkars",
        votes: 100,
        created_at: jsTime1,
      },
      {
        body: "The owls are not what they seem.",
        article_id: 3,
        author: "icellusedkars",
        votes: 20,
        created_at: jsTime2,
      },
    ];
  });
});
