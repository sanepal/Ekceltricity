var households = require('./data/households.json');
var users = require('./data/users.json');
var appliances = require('./data/appliances.json');

exports.getHouseholds = function() {
  return households;
}

exports.getHousehold = function(id) {
  return households[id];
}

exports.createHousehold = function(data) {
  data.id = households.length;
  households.push(data);
  return data.id;
}

exports.editHousehold = function(data) {
  households[data.id].name = data.name;
  households[data.id].rate = data.rate;
  households[data.id].members = data.members;
}

exports.createOrGetUser = function(email) {
  if (users[email] === undefined) {
    users[email] = {
      'name': email, 
      'id': Object.keys(users).length
    };
  }
  return users[email];
}

exports.getUser = function(id) {
  for (var user in users) {
    if (users[user].id == id) {
      return users[user];
    }
  }
}

exports.createAppliance = function(data) {
  data.id = appliances.length;
  appliances.push(data);
  return data.id;
}

exports.addAppliance = function(householdId, userId, applianceId) {
  households[householdId].members[userId].push(applianceId);
}

exports.getAppliance = function(applianceId) {
  return appliances[applianceId];
}

exports.toggle = function(applianceId) {
  if (appliances[applianceId].status === 1) {
    appliances[applianceId].usage[appliances[applianceId].usage.length - 1].end = Date.now();
    appliances[applianceId].status = 0;
  } else {
    appliances[applianceId].usage.push({'start': Date.now()});
    appliances[applianceId].status = 1;
  }
}