////////////////////////////////////////////////////////////////////////////////
///// REQUIREMENTS & SETUP
////////////////////////////////////////////////////////////////////////////////

const express = require("express");
const cookieParser = require("cookie-parser");
const { generateRandomString, checkRegistration, passwordValidation, getUserIDbyEmail } = require("./helperFunctions");
const app = express();
const PORT = 8080;

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`)
});

////////////////////////////////////////////////////////////////////////////////
///// CONSTANTS
////////////////////////////////////////////////////////////////////////////////

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xk": "http://www.google.com"
};

const users = {};

////////////////////////////////////////////////////////////////////////////////
///// URLS RESOURCES
////////////////////////////////////////////////////////////////////////////////

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
}); // sets up the initial database

app.get("/urls", (req, res) => {
  const userID = req.cookies.userID;
  const templateVars = { urls: urlDatabase, user: users[userID] };
  res.render("urls_index", templateVars);
}); // renders the index page

app.get("/urls/new", (req, res) => {
  const userID = req.cookies.userID;
  const templateVars = { user: users[userID] };
  res.render("urls_new", templateVars);
}); // adds a new URL

app.get("/urls/:id", (req, res) => {
  const userID = req.cookies.userID;
  const templateVars = { id: req.params.id, longURL: urlDatabase[req.params.id], user: users[userID] };
  res.render("urls_show", templateVars);
}); // individual URL page for editing the longURL

app.get("/u/:id", (req, res) => {
  const longURL = urlDatabase[req.params.id]; 
  res.redirect(longURL);
}); // use the id in the url as a key to access the longURL (key/value pair in urlDatabase object)

app.post("/urls", (req, res) => {
  const longURL = req.body.longURL;
  const shortURL = generateRandomString();
  if (longURL.length === 0) {
    return res.status(400).send("ERROR 400: Cannot submit empty URL.");
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

////////////////////////////////////////////////////////////////////////////////
///// USERS RESOURCES
////////////////////////////////////////////////////////////////////////////////

app.get("/login", (req, res) => {
  const userID = req.cookies.userID;
  const templateVars = { user: users[userID] }
  res.render("login", templateVars);
}); // uses template to render login form page

app.post("/login", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  if (!checkRegistration(email, users)) {
    return res.status(403).send("ERROR 403: No account associated with that email address.");
  } else if (!passwordValidation(email, password, users)) {
    return res.status(403).send("ERROR 403: Password does not match our records.");
  }

  let userID = getUserIDbyEmail(email, users);
  res.cookie("userID", userID);
  return res.redirect(`/urls`);

}); // logging in 

app.post("/logout", (req, res) => {
  res.clearCookie("userID");
  return res.redirect(`/urls`);
}); // logging out

app.get("/register", (req, res) => {
  const userID = req.cookies.userID;
  const templateVars = { user: users[userID] }
  res.render("register", templateVars);
}); // renders registration form page

app.post("/register", (req, res) => {
  const userID = generateRandomString();
  const email = req.body.email;
  const password = req.body.password;

  if (email.length === 0 || password.length === 0) {
    return res.status(400).send("ERROR 400: Invalid email and/or password.");
  } 
  else if (checkRegistration(email, users)) {
    return res.status(400).send("ERROR 400: This email is already registered!");
  }

  users[userID] = { id: userID, email: email, password: password };
  res.cookie("userID", userID);
  console.log(users);

  return res.redirect(`/urls`);
}); // adding an account to the users database
