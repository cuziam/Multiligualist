const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const sampleHtml = require("../__test__/sampleHtml");
const dom = new JSDOM(sampleHtml);

const axios = require("axios");
jest.mock("axios");

describe("makeDropdown", () => {
  it("proper", () => {
    expect(document.querySelector("#dropdown")).not.toBeNull();
  });
});
