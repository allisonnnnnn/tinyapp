const { assert } = require("chai");
const { checkEmail } = require("../helper_function/helpers");

const testUsers = {
  userRandomID: {
    id: "userRandomID",
    email: "user@example.com",
    password: "purple-monkey-dinosaur"
  },
  user2RandomID: {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "dishwasher-funk"
  }
};

describe("checkEmail", () => {
  it("should return a user with valid email", () => {
    const user = checkEmail("user@example.com", testUsers);
    const expectedOutput = "userRandomID";
    // assert.equal(actual, expected);
    assert.equal(user.id, expectedOutput);
  });
  it("should return undefined if non-existent email tested", () => {
    const user = checkEmail("123@example.com", testUsers);
    const expectedOutput = undefined;
    assert.equal(user, expectedOutput);
  });
});
