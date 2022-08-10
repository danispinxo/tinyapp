const { assert } = require('chai');
const { getUserIDbyEmail, checkRegistration } = require('../helperFunctions');

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

describe('getUserByEmail', function() {

  it('should return a user with valid email', function() {
    const user = getUserIDbyEmail("user@example.com", testUsers);
    const expectedUserID = "userRandomID";
    assert.equal(user, expectedUserID);
  });

  it('should return a user with valid email', function() {
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
