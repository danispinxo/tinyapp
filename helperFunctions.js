const bcrypt = require("bcryptjs");

function generateRandomString(length = 6) {
  let chars = 'ABCDEFGHIJLKMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let str = '';

  for (let i = 0; i < length; i++) {
      str += chars.charAt(Math.floor(Math.random() * chars.length));
  }

  return str;
};

function checkRegistration(email, users) {
  for (let user in users) {
    if (users[user].email === email) {
      return true;
    }
  }
  return false;
};

function passwordValidation(email, password, users) {
  for (let user in users) {
    if (users[user].email === email) {
      if (bcrypt.compareSync(password, users[user].password)) {
        return true;
      }
    }
  }
  return false;
};

function getUserIDbyEmail(email, users) {
  for (let user in users) {
    if (users[user].email === email) {
      return users[user].id;
    }
  }
  return "No such user";
};

function urlsForUser(id, urls) {
  let userURLs = {};

  for (let url in urls) {
    if (urls[url].userID === id) {
      userURLs[url] = {};
      userURLs[url].userID = id;
      userURLs[url].longURL = urls[url].longURL;
    } 
  }

  return userURLs;
}

module.exports = {
  generateRandomString,
  checkRegistration, 
  passwordValidation, 
  getUserIDbyEmail,
  urlsForUser
}

// TESTER CODE

// const urls = {
//   'H8ZKdA': { 
//     longURL: 'http://www.genericpronoun.com', 
//     userID: 'UmYDbc' 
//   },
//   'E8bGoa': {
//     longURL: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript',
//     userID: 'UmYDbc'
//   },
//   '5RKWxj': { 
//     longURL: 'https://www.jptherapystudios.com/', 
//     userID: 'UNNYDbc' 
//   }
// }

// let result = urlsForUser('UmYDbc', urls);
// console.log(result);