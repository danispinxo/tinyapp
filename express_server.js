////////////////////////////////////////////////////////////////////////////////
///// REQUIREMENTS & SETUP
////////////////////////////////////////////////////////////////////////////////

const express = require('express');
const methodOverride = require('method-override');
const cookieSession = require('cookie-session');
const morgan = require('morgan');
const bcrypt = require('bcryptjs');

const {
  generateRandomString,
  checkRegistration,
  passwordValidation,
  getUserIDbyEmail,
  urlsForUser
} = require("./helperFunctions");

const app = express();
const PORT = 8080;

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(cookieSession({
  name: 'session',
  keys: ['user_id'],
  maxAge: 24 * 60 * 60 * 1000 // 24 hours
}));
app.use(morgan("dev"));

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

////////////////////////////////////////////////////////////////////////////////
///// CONSTANTS
////////////////////////////////////////////////////////////////////////////////

const urlDatabase = {};

const users = {};

let isLoggedIn = false;

////////////////////////////////////////////////////////////////////////////////
///// URL RESOURCES
////////////////////////////////////////////////////////////////////////////////

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
}); // sets up the initial database

app.get("/urls", (req, res) => {
  const userID = req.session.user_id;
  const userURLS = urlsForUser(userID, urlDatabase);
  const templateVars = { urls: userURLS, user: users[userID], isLoggedIn: isLoggedIn };
  res.render("urls_index", templateVars);
}); // renders the index page

app.get("/urls/new", (req, res) => {
  const userID = req.session.user_id;
  const templateVars = { user: users[userID], isLoggedIn: isLoggedIn };

  if (!isLoggedIn) {
    res.redirect("/login");
  }

  res.render("urls_new", templateVars);
}); // adds a new URL

app.get("/urls/:id", (req, res) => {
  const userID = req.session.user_id;
  const userURLS = urlsForUser(userID, urlDatabase);

  if (!userID) {
    return res.status(404).send("ERROR 404: You must log in to view this URL page.");
  }

  if (!userURLS[req.params.id]) {
    return res.status(404).send("ERROR 404: You do not have the permissions to view this URL page.");
  }

  const templateVars = { id: req.params.id, longURL: userURLS[req.params.id].longURL, user: users[userID], isLoggedIn: isLoggedIn, numberOfVisits: req.session.numberOfVisits, visits: req.session.visits };
  res.render("urls_show", templateVars);
}); // individual URL page for editing the longURL

app.get("/u/:id", (req, res) => {
  if (!urlDatabase[req.params.id]) {
    return res.status(404).send("ERROR 404: Shortened URL not found.");
  }

  const longURL = urlDatabase[req.params.id].longURL;

  req.session.numberOfVisits++;
  let visitor = req.session.visitorID;
  let timestamp = new Date();
  timestamp.toLocaleTimeString();

  req.session.visits.push(`This shorted URL was visited by VistorID: ${visitor} at ${timestamp}`);

  return res.redirect(longURL);
}); // use the id in the url as a key to access the longURL (key/value pair in urlDatabase object)

app.post("/urls", (req, res) => {
  const userID = req.session.user_id;
  const longURL = req.body.longURL;
  const shortURL = generateRandomString();

  if (longURL.length === 0) {
    return res.status(400).send("ERROR 400: Cannot submit empty URL.");
  }
  req.session.numberOfVisits = 0;
  req.session.visitorID = generateRandomString();
  req.session.visits = [];

  urlDatabase[shortURL] = { longURL: longURL, userID: userID};

  return res.redirect(`/urls`);
}); // creating a new shortURL

app.delete("/urls/:id", (req, res) => {
  const userID = req.session.user_id;

  if (!isLoggedIn) {
    return res.status(400).send("ERROR 400: Cannot delete URLs when not logged in.");
  }

  const userURLS = urlsForUser(userID, urlDatabase);

  if (!userURLS[req.params.id]) {
    return res.status(400).send("ERROR 400: You do not have the permissions to delete this URL.");
  }

  delete urlDatabase[req.params.id];

  return res.redirect(`/urls`);
}); // deleting a URL

app.put("/urls/:id", (req, res) => {
  if (!isLoggedIn) {
    return res.status(400).send("ERROR 400: Cannot edit URLs when not logged in.");
  }
  const userID = req.session.user_id;
  const userURLS = urlsForUser(userID, urlDatabase);

  if (!userURLS[req.params.id]) {
    return res.status(400).send("ERROR 400: You do not have the permissions to edit this URL.");
  }

  urlDatabase[req.params.id].longURL = req.body.longURL;
  return res.redirect(`/urls`);
}); // editing a long URL

////////////////////////////////////////////////////////////////////////////////
///// USER RESOURCES
////////////////////////////////////////////////////////////////////////////////

app.get("/login", (req, res) => {
  const userID = req.session.user_id;
  const templateVars = { user: users[userID], isLoggedIn: isLoggedIn };

  if (isLoggedIn) {
    res.redirect("/urls");
  }

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
  req.session.user_id = userID;
  isLoggedIn = true;
  return res.redirect(`/urls`);

}); // logging in

app.post("/logout", (req, res) => {
  req.session = null;
  isLoggedIn = false;

  return res.redirect(`/urls`);
}); // logging out

app.get("/register", (req, res) => {
  const userID = req.session.user_id;
  const templateVars = { user: users[userID], isLoggedIn: isLoggedIn };

  if (isLoggedIn) {
    res.redirect("/urls");
  }
  res.render("register", templateVars);
}); // renders registration form page

app.post("/register", (req, res) => {
  const userID = generateRandomString();
  const email = req.body.email;
  const password = bcrypt.hashSync(req.body.password, 10);

  if (email.length === 0 || password.length === 0) {
    return res.status(400).send("ERROR 400: Invalid email and/or password.");
  } else if (checkRegistration(email, users)) {
    return res.status(400).send("ERROR 400: This email is already registered!");
  }

  users[userID] = { id: userID, email: email, password: password };
  req.session.user_id = userID;
  isLoggedIn = true;

  return res.redirect(`/urls`);
}); // adding an account to the users database
