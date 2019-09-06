const express = require("express");
const app = express();
const PORT = 8080;
const bodyParser = require("body-parser");
const cookieSession = require("cookie-session");
const bcrypt = require("bcrypt");
const {
  users,
  urlDatabase,
  checkEmail,
  findUser,
  urlsForUser
} = require("./helper_function/helpers");

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  cookieSession({
    name: "user_id",
    keys: ["randomeID"]
  })
);

// Database;

// Route Handlers
app.get("/", (req, res) => {
  res.send("hello!");
});

app.get("/urls", (req, res) => {
  res.render("urls_index", {
    urls: urlsForUser(req.session.user_id),

    user: findUser(req.session.user_id)
  });
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/urls/new", (req, res) => {
  if (req.session.user_id) {
    res.render("urls_new", { user: findUser(req.session.user_id) });
  } else {
    res.redirect("/login");
  }
});

app.post("/urls", (req, res) => {
  let key = generateRandomString();

  urlDatabase[key] = {
    userID: req.session.user_id,
    longURL: req.body.longURL
  };

  res.redirect("/urls");
});

app.get("/urls/:shortURL", (req, res) => {
  const url = urlDatabase[req.params.shortURL];
  if (url && url.userID === req.session.user_id) {
    res.render("urls_show", {
      shortURL: req.params.shortURL,
      longURL: urlDatabase[req.params.shortURL].longURL,
      user: findUser(req.session.user_id),
      urls: urlsForUser(req.session.user_id),
      userID: urlDatabase[req.params.shortURL].userID
    });
  }
  res.redirect("/login");
});

app.get("/u/:shortURL", (req, res) => {
  res.redirect(urlDatabase[req.params.shortURL].longURL);
});

// Delete
app.post("/urls/:shortURL/delete", (req, res) => {
  // delete key
  delete urlDatabase[req.params.shortURL];
  res.redirect("/urls");
});

app.post("/urls/:shortURL", (req, res) => {
  if (req.session.user_id === urlDatabase[req.params.shortURL].userID) {
    urlDatabase[req.params.shortURL].longURL = req.body.longURL;
  }

  res.redirect("/urls");
});

// Login & Set Cookie
app.get("/login", (req, res) => {
  res.render("login", { user: findUser(req.session.user_id) });
});

app.post("/login", (req, res) => {
  let randomID;

  for (let user in users) {
    if (users[user].email === req.body.email) {
      if (bcrypt.compareSync(req.body.password, users[user].password)) {
        randomID = user;

        req.session.user_id = randomID;

        res.redirect("/urls");
        return;
      } else {
        res.status(403).send("Email or Password does not match");
      }
    }
  }
  res.status(403).send("Email does not exist");
});

// Logout
app.post("/logout", (req, res) => {
  res.clearCookie("user_id");

  res.redirect("/urls");
});

// Register
app.get("/register", (req, res) => {
  res.render("register", { user: findUser(req.session.user_id) });
});

app.post("/register", (req, res) => {
  let randomID = generateRandomString();
  if (req.body.email === "" || req.body.password === "") {
    res.status(400).send("Email or Password is empty");
  } else if (checkEmail(req.body.email, users)) {
    res.status(400).send("Email already existed");
  } else {
    users[randomID] = {
      id: randomID,
      email: req.body.email,
      password: bcrypt.hashSync(req.body.password, 10)
    };

    // Set Cookie
    req.session.user_id = randomID;
    res.redirect("/urls");
  }
});

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

// does not show long urls
