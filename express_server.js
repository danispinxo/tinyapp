const express = require("express");
const app = express();
const PORT = 8080;

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xk": "http://www.google.com"
};

function generateRandomString (length = 6) {
  let chars = 'ABCDEFGHIJLKMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let str = '';
  for (let i = 0; i < length; i++) {
      str += chars.charAt(Math.floor(Math.random() * chars.length));
  }

  return str;
};

app.get("/", (req, res) => {
  res.send("Hello!");
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`)
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n")
})

app.get("/urls", (req, res) => {
  const templateVars = { urls: urlDatabase};
  res.render("urls_index", templateVars);
})

app.get("/urls/new", (req, res) => {
  res.render("urls_new");
});

app.get("/urls/:id", (req, res) => {
  const templateVars = { id: req.params.id, longURL: req.params.longURL };
  res.render("urls_show", templateVars);
});

app.get("/u/:id", (req, res) => {
  const longURL = urlDatabase[req.params.id]; // use the id in the url as a key to access the longURL (key/value pair in urlDatabase object)
  res.redirect(longURL);
});


app.post("/urls", (req, res) => {
  console.log(req.body.longURL); // Log the POST request body to the console
  const longURL = req.body.longURL;
  const shortURL = generateRandomString();

  if (longURL.length < 1) {
    return res.statusCode(400).send("Cannot submit empty URL.");
  }
  urlDatabase[shortURL] = longURL;
  console.log(urlDatabase);

  return res.redirect(`/urls`); // Respond with 'Ok' (we will replace this)

});