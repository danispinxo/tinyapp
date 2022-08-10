const { assert } = require('chai');
const { getUserIDbyEmail, checkRegistration, urlsForUser } = require('../helperFunctions');

const testUsers = {
  "userRandomID": {
    id: "userRandomID", 
    email: "user@example.com", 
    password: "purple-monkey-dinosaur"
  },
  "user2RandomID": {
    id: "user2RandomID", 
    email: "user2@example.com", 
    password: "dishwasher-funk"
  }
};

const urlDatabase = {
  cw3ee0: {
    longURL: 'http://www.genericpronoun.com',
    userID: 'SQKZbQ' 
  },
  l04f0k: {
    longURL: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript',
    userID: 'WRONGUSER'
  },
  zsSKE6: { 
    longURL: 'https://www.jptherapystudios.com/',
    userID: 'SQKZbQ' 
  }
};

describe('getUserByEmail', function() {

  it('should return a user with valid email', function() {
    const user = getUserIDbyEmail("user@example.com", testUsers);
    const expectedUserID = "userRandomID";
    assert.equal(user, expectedUserID);
  });

  it('should return undefined if not a valid email', function() {
    const user = getUserIDbyEmail("daniiscoding@example.com", testUsers);
    const expectedUserID = "userRandomID";
    assert.isUndefined(user, expectedUserID);
  });

});

describe('checkRegistration', function() {

  it('should return true if the email has a registered account', function() {
    const user = checkRegistration("user@example.com", testUsers);
    assert.isTrue(user);
  });

  it('should return false if the user does not have a registered account', function() {
    const user = checkRegistration("daniiscoding@example.com", testUsers);
    assert.isFalse(user);
  });

});

describe('urlsForUser', function() {

  it('should only return the URLS for the given user', function() {

    const result = urlsForUser('SQKZbQ', urlDatabase);
    const expectedResult = {
      cw3ee0: {
        longURL: 'http://www.genericpronoun.com',
        userID: 'SQKZbQ' 
      },
      zsSKE6: { 
        longURL: 'https://www.jptherapystudios.com/',
        userID: 'SQKZbQ' 
      }
    }
    assert.deepEqual(result, expectedResult)
  });

  it('should return an empty object if no URLs are assigned to that user', function() {

    const result = urlsForUser('DANIUSER', urlDatabase);
    const expectedResult = {};
    assert.deepEqual(result, expectedResult)
  });

});