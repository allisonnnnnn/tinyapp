const express = require("express");
const app = express();
const PORT = 8080;
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

// Database
const urlDatabase = {
  b2xVn2: "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

// Route Handlers
app.get("/", (req, res) => {
  res.send("hello!");
});

app.get("/urls", (req, res) => {
  res.render("urls_index", {
    urls: urlDatabase,
    username: req.cookies.username
  });
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/hello", (req, res) => {
  res.send(`<html><body>Hello <b>World</b></body></html>\n`);
});

app.get("/urls/new", (req, res) => {
  res.render("urls_new", { username: req.cookies.username });
});
// why the path here is urls?why post request to /urls?
app.post("/urls", (req, res) => {
  // console.log(req.body);
  let key = generateRandomString();
  urlDatabase[key] = req.body.longURL;
  res.redirect("/urls");
});

// app.get("/urls/delete", (req, res) => {
//   delete urlDatabase[req.query.shortURL];
//   res.redirect("/urls");
// });

app.get("/urls/:shortURL", (req, res) => {
  // console.log(req.body);
  // console.log(req.params);

  res.render("urls_show", {
    shortURL: req.params.shortURL,
    longURL: urlDatabase[req.params.shortURL],
    username: req.cookies.username
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
  // console.log(req.body.longURL);
  // console.log(req.params);
  urlDatabase[req.params.shortURL] = req.body.longURL;
  res.redirect("/urls");
});

// Login & Set cookies
app.post("/login", (req, res) => {
  res.cookie("username", req.body.username);
  // console.log(req.body);
  res.redirect("urls");
});

// Logout
app.post("/logout", (req, res) => {
  res.clearCookie("username");
  res.redirect("/urls");
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
