var households = require('./data/households.json');
var users = require('./data/users.json');

exports.getHouseholds = function() {
  return households;
}

exports.getHousehold = function(id) {
  console.log(households);
  return households[id];
}

exports.createHousehold = function(data) {
  data.id = households.length;
  households.push(data);
  return data.id;
}

exports.createOrGetUser = function(email) {
  if (users.email === undefined) {
    users.email = {
      'name': Math.random().toString(36).substring(7), 
      'id': Object.keys(users).length
    };
  }
  return users.email;
}

exports.getUser = function(id) {
  for (var user in users) {
    if (users[user].id == id) {
      return users[user];
    }
  }
}