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
    if (users[user].email === email && users[user].password === password) {
      return true;
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
}

module.exports = {
  generateRandomString,
  checkRegistration, 
  passwordValidation, 
  getUserIDbyEmail
}

// TESTER CODE

// const users = {
//   '0qg7iJ': {
//     id: '0qg7iJ',
//     email: 'genericpronoun@gmail.com',
//     password: 'lllllll'
//   },
//   T0tkPl: { id: 'T0tkPl', email: 'danispin@yorku.ca', password: 'lllllll' },
//   dhpL1p: {
//     id: 'dhpL1p',
//     email: 'gapriotpress@gmail.com',
//     password: 'lllllll'
//   }
// };

// let result = checkRegistration("genericpronoun@gmail.com", users);
// console.log(result);