// Database
const bcrypt = require("bcrypt");
const urlDatabase = {
  b6UTxQ: { longURL: "https://www.tsn.ca", userID: "aJ48lW" },
  i3BoGr: { longURL: "https://www.google.ca", userID: "aJ48lW" }
};
const users = {
  userRandomID: {
    id: "userRandomID",
    email: "user@example.com",
    password: bcrypt.hashSync("purple-monkey-dinosaur", 10)
  },
  user2RandomID: {
    id: "user2RandomID",
    email: "user2@example.com",
    password: bcrypt.hashSync("dishwasher-funk", 10)
  }
};

// Helper functions
const checkEmail = function(email, database) {
  for (let user in users) {
    if (database[user].email === email) {
      return database[user];
    }
  }
  return undefined;
};

const findUser = function(userId) {
  if (users[userId]) {
    return users[userId];
  }
  return null;
};

const urlsForUser = function(id) {
  let urls = {};
  for (let item in urlDatabase) {
    if (urlDatabase[item].userID === id) {
      urls[item] = urlDatabase[item];
    }
  }
  return urls;
};

module.exports = { users, urlDatabase, checkEmail, findUser, urlsForUser };
