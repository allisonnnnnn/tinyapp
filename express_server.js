const express = require("express");
const app = express();
const PORT = 8080;
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

// Database
// const urlDatabase = {
//   b2xVn2: "http://www.lighthouselabs.ca",
//   "9sm5xK": "http://www.google.com"
// };

const urlDatabase = {
  b6UTxQ: { longURL: "https://www.tsn.ca", userID: "aJ48lW" },
  i3BoGr: { longURL: "https://www.google.ca", userID: "aJ48lW" }
};
const users = {
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

// Helper functions
const checkEmail = function(email) {
  for (let user in users) {
    console.log(user);
    if (users[user].email === email) {
      return true;
    }
  }
  return false;
};

const findUser = function(userId) {
  if (users[userId]) {
    return users[userId];
  }
};

// const urlsForUser = function(id) {
//   for (let item in urlDatabase) {
//     if (urlDatabase[item].userID === id) {
//       return urlDatabase[item].longURL;
//     }
//   }
// };
// Route Handlers
app.get("/", (req, res) => {
  // console.log(req.cookies.user_id);
  res.send("hello!");
});

app.get("/urls", (req, res) => {
  // if (urlsForUser(req.cookies.user_id)) {
  res.render("urls_index", {
    urls: urlDatabase,
    user: findUser(req.cookies.user_id)
  });
  // }
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/hello", (req, res) => {
  res.send(`<html><body>Hello <b>World</b></body></html>\n`);
});

app.get("/urls/new", (req, res) => {
  for (let user in users) {
    if (users[user].email === req.body.email) {
      res.render("urls_new", { user: findUser(req.cookies.user_id) });
    } else {
      res.redirect("/login");
    }
  }
});
// why the path here is urls?why post request to /urls?
app.post("/urls", (req, res) => {
  let key = generateRandomString();
  urlDatabase[key] = req.body.longURL;
  res.redirect("/urls");
});

app.get("/urls/:shortURL", (req, res) => {
  res.render("urls_show", {
    shortURL: req.params.shortURL,
    longURL: urlDatabase[req.params.shortURL],
    user: findUser(req.cookies.user_id)
  });
});

app.get("/u/:shortURL", (req, res) => {
  res.redirect(urlDatabase[req.params.shortURL]);
});

// Delete
app.post("/urls/:shortURL/delete", (req, res) => {
  // console.log(req.params);
  // delete key
  delete urlDatabase[req.params.shortURL];
  res.redirect("/urls");
});

app.post("/urls/:shortURL", (req, res) => {
  urlDatabase[req.params.shortURL] = req.body.longURL;
  res.redirect("/urls");
});

// Login & Set Cookie
app.get("/login", (req, res) => {
  res.render("login", { user: findUser(req.cookies.user_id) });
});

app.post("/login", (req, res) => {
  let randomID;

  for (let user in users) {
    if (users[user].email === req.body.email) {
      if (users[user].password === req.body.password) {
        randomID = user;
        res.cookie("user_id", randomID);
        res.redirect("/urls");
        return;
      } else {
        res.status(403);
      }
    }
  }
  res.status(403);
});

// Logout
app.post("/logout", (req, res) => {
  res.clearCookie("user_id");
  res.redirect("/urls");
});

// Register
app.get("/register", (req, res) => {
  res.render("register", { user: null });
});

app.post("/register", (req, res) => {
  let randomID = generateRandomString();
  if (req.body.email === "" || req.body.password === "") {
    res.status(400).send("Email or Password is empty");
  } else if (checkEmail(req.body.email)) {
    // should not redirect
    res.status(400).send("Email already existed");
  } else {
    users[randomID] = {
      id: randomID,
      email: req.body.email,
      password: req.body.password
    };
    // console.log("users", users);
    // Set Cookie
    res.cookie("user_id", randomID);

    res.redirect("urls");
  }
});

// console.log(users);

app.listen(PORT, () => {
  console.log(`example app listening on port ${PORT}`);
});

const generateRandomString = function() {
  const chars =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let length = 6;
  let result = "";
  for (let i = 0; i <= length; i++) {
    result += chars.charAt(Math.floor(Math.random() * length));
  }
  return result;
};
