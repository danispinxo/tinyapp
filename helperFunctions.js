const bcrypt = require("bcryptjs");

const generateRandomString = function(length = 6) {
  let chars = 'ABCDEFGHIJLKMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let str = '';

  for (let i = 0; i < length; i++) {
    str += chars.charAt(Math.floor(Math.random() * chars.length));
  }

  return str;
};

const checkRegistration = function(email, users) {
  for (let user in users) {
    if (users[user].email === email) {
      return true;
    }
  }
  return false;
};

const passwordValidation = function(email, password, users) {
  for (let user in users) {
    if (users[user].email === email) {
      if (bcrypt.compareSync(password, users[user].password)) {
        return true;
      }
    }
  }
  return false;
};

const getUserIDbyEmail = function(email, users) {
  for (let user in users) {
    if (users[user].email === email) {
      return users[user].id;
    }
  }
};

const urlsForUser = function(id, urls) {
  let userURLs = {};

  for (let url in urls) {
    if (urls[url].userID === id) {
      userURLs[url] = {};
      userURLs[url].userID = id;
      userURLs[url].longURL = urls[url].longURL;
    }
  }

  return userURLs;
};

module.exports = {
  generateRandomString,
  checkRegistration,
  passwordValidation,
  getUserIDbyEmail,
  urlsForUser
};