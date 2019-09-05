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
    // longURL: urlDatabase[req.params.shortURL].longURL,
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
// why the path here is urls?why post request to /urls?
app.post("/urls", (req, res) => {
  let key = generateRandomString();
  // urlDatabase[key] = req.body.longURL;
  urlDatabase[key] = {
    userID: req.session.user_id,
    longURL: req.body.longURL
  };
  // console.log(req.body.longURL);
  res.redirect("/urls");
});

app.get("/urls/:shortURL", (req, res) => {
  res.render("urls_show", {
    shortURL: req.params.shortURL,
    longURL: urlDatabase[req.params.shortURL].longURL,
    user: findUser(req.session.user_id),
    urls: urlsForUser(req.session.user_id),
    userID: urlDatabase[req.params.shortURL].userID
  });
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

// ??
app.post("/urls/:shortURL", (req, res) => {
  console.log(urlDatabase[req.params.shortURL]);
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
      if (users[user].password === req.body.password) {
        randomID = user;
        // res.cookie("user_id", randomID);
        // req.session("user_id", randomID);
        req.session.user_id = randomID;
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
  // req.session = null?
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
    console.log("users", users);
    // Set Cookie
    // res.cookie("user_id", randomID);

    // req.session("user_id", randomID);
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

// Edit does not work
// logout --> /urls
// does not show long urls
// register -> logout --> cannot relogin
// Similarly, this also means that the /urls/:id page should display a message or prompt if the user is not logged in, or if the the URL with the matching :id does not belong to them.
