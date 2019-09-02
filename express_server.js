const express = require("express");
const app = express();
const PORT = 8080;

app.set("view engine", "ejs");

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
  res.render("urls_index", { urls: urlDatabase });
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/hello", (req, res) => {
  res.send(`<html><body>Hello <b>World</b></body></html>\n`);
});

app.get("/urls/:shortURL", (req, res) => {
  res.render("urls_show", {
    shortURL: req.params.shortURL,
    longURL: urlDatabase[req.params.shortURL]
  });
});

app.listen(PORT, () => {
  console.log(`example app listening on port ${PORT}`);
});
