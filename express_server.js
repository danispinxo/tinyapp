////////////////////////////////////////////////////////////////////////////////
///// REQUIREMENTS & SETUP
////////////////////////////////////////////////////////////////////////////////

const express = require("express");
const cookieParser = require("cookie-parser");
const app = express();
const PORT = 8080;

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

////////////////////////////////////////////////////////////////////////////////
///// HELPER FUNCTIONS
////////////////////////////////////////////////////////////////////////////////

function generateRandomString (length = 6) {
  let chars = 'ABCDEFGHIJLKMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let str = '';
  for (let i = 0; i < length; i++) {
      str += chars.charAt(Math.floor(Math.random() * chars.length));
  }

  return str;
};

////////////////////////////////////////////////////////////////////////////////
///// CONSTANTS
////////////////////////////////////////////////////////////////////////////////

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xk": "http://www.google.com"
};

////////////////////////////////////////////////////////////////////////////////
///// REQUESTS & RESPONSES
////////////////////////////////////////////////////////////////////////////////

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`)
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/urls", (req, res) => {
  const templateVars = { urls: urlDatabase, username: req.cookies["username"] };
  res.render("urls_index", templateVars);
}); // renders the index page

app.get("/urls/new", (req, res) => {
  const templateVars = { username: req.cookies["username"] };
  res.render("urls_new", templateVars);
}); // adds a new URL

app.get("/urls/:id", (req, res) => {
  const templateVars = { id: req.params.id, longURL: urlDatabase[req.params.id], username: req.cookies["username"] };
  res.render("urls_show", templateVars);
}); // individual URL page for editing the longURL

app.get("/u/:id", (req, res) => {
  const longURL = urlDatabase[req.params.id]; // use the id in the url as a key to access the longURL (key/value pair in urlDatabase object)
  res.redirect(longURL);
});

app.post("/urls", (req, res) => {
  const longURL = req.body.longURL;
  const shortURL = generateRandomString();
  if (longURL.length === 0) {
    return res.statusCode(400).send("Cannot submit empty URL.");
  }
  urlDatabase[shortURL] = longURL;
  return res.redirect(`/urls`);
}); // creating a new shortURL

app.post("/urls/:id/delete", (req, res) => {
  delete urlDatabase[req.params.id];
  return res.redirect(`/urls`);
}); // deleting a URL

app.post("/urls/:id/edit", (req, res) => {
  urlDatabase[req.params.id] = req.body.longURL;
  return res.redirect(`/urls`);
}); // editing a long URL

app.post("/login", (req, res) => {
  res.cookie("username", req.body.username);
  return res.redirect(`/urls`);
}); // logging in && setting username cookie

app.post("/logout", (req, res) => {
  res.clearCookie("username");
  return res.redirect(`/urls`);
}); // logging in && setting username cookie

app.get("/register", (req, res) => {
  const templateVars = { username: req.cookies["username"] }
  res.render("register", templateVars);
}); // registering for an account