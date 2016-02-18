var households = require('./data/households.json');
var users = require('./data/users.json');
var appliances = require('./data/appliances.json');
var runningHouseholdId = -1;
var runningUserId = -1;
var runningApplianceId = -1;

exports.init = function() {
  var max = 0, userMax = 0;
  for (var i = 0; i < households.length; i++) {
    if (households[i].id > max) {
      max = households[i].id;
    }
    for (var j = 0; j < households[i].members.length; j++) {
      if (households[i].members[j].id > userMax) {
        userMax = households[i].members[j].id;
      }
    }
  }
  runningHouseholdId = max;
  runningUserId = userMax;
  max = 0;
  for (var i = 0; i < appliances.length; i++) {
    if (appliances[i].id > max) {
      max = appliances[i].id;
    }
  }
  runningApplianceId = max;
  console.log("inited db with runningHouseholdId: " + runningHouseholdId + ", runningUserId: " + runningUserId + ", and runningApplianceId: " + runningApplianceId);
}

exports.getHouseholds = function() {
  return households;
}

exports.getHousehold = function(id) {
  for (var i = 0; i < households.length; i++) {
    if (households[i].id == id) {
      return households[i];
    }
  }
  return undefined;
}

exports.createHousehold = function(data) {
  data.id = ++runningHouseholdId;
  households.push(data);
  return data.id;
}

exports.editHousehold = function(data) {
  var idx = 0;
  for (var i = 0 ; i < households.length; i++) {
    if (households[i].id == data.id) {
      idx = i;
      break;
    }
  }
  households[idx].name = data.name;
  households[idx].rate = data.rate;
  households[idx].members = data.members;
}

exports.createOrGetUser = function(email) {
  var newId = ++runningUserId;
  if (users[email] === undefined) {
    users[email] = {
      'name': email, 
      'id': newId
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
  data.id = ++runningApplianceId;
  appliances.push(data);
  return data.id;
}

exports.addAppliance = function(householdId, userId, applianceId) {
  var householdIdx = -1;
  for (var i = 0; i < households.length; i++) {
    if (households[i].id == householdId) {
      householdIdx = i;
      break;
    }
  }
  var userIdx = -1;
  for (var i = 0; i < households[householdIdx].members.length; i++) {
    if (households[householdIdx].members[i].id == userId) {
        userIdx = i;
        break;
    }
  }
  households[householdIdx].members[userIdx].appliances.push(applianceId);
}

exports.deleteAppliance = function(householdId, applianceId) {
  var applianceIdx = 0;
  for (var i = 0; i < appliances.length; i++) {
    if (appliances[i].id == applianceId) {
      applianceIdx = i;
      break;
    }
  }
  var memberId = appliances[applianceIdx].owner;
  // remove from appliance json
  var removeIdx = 0;
  for (var i = 0; i < appliances.length; i++) {
    if (appliances[i].id == applianceId) {
      removeIdx = i;
      break;
    }
  }
  appliances.splice(removeIdx, 1);

  // remove from household json
  applianceIdx = -1;
  var householdIdx = -1, memberIdx = -1;
  for (var i = 0; i < households.length; i++) {
    if (households[i].id == householdId) {
      householdIdx = i;
      for (var j = 0; j < households[i].members.length; j++) {
        if (households[i].members[j].id == memberId) {
          memberIdx = j;
          for (var k = 0; k < households[i].members[j].appliances.length; k++) {
            if (households[i].members[j].appliances[k] == applianceId) {
              applianceIdx = k;
              break;
            }
          }
          break;
        }
      }
      break;
    }
  }
  console.log("householdIdx: " + householdIdx + ", memberIdx: " + memberIdx + ", applianceIdx: " + applianceIdx);
  if (householdIdx != -1 && memberIdx != -1 && applianceIdx != -1) {
      households[householdIdx].members[memberIdx].appliances.splice(applianceIdx, 1);
  }
}

exports.updateAppliance = function(applianceId, newName, newRate) {
  var applianceIdx = 0;
  for (var i = 0; i < appliances.length; i++) {
    if (appliances[i].id == applianceId) {
      applianceIdx = i;
      break;
    }
  }
  appliances[applianceIdx].name = newName;
  appliances[applianceIdx].rate = newRate;
}

exports.getAppliance = function(applianceId) {
  for (var i = 0; i < appliances.length; i++) {
    if (appliances[i].id == applianceId) {
      return appliances[i];
    }
  }
  return undefined;
}

exports.toggle = function(applianceId) {
  var applianceIdx = 0;
  for (var i = 0; i < appliances.length; i++) {
    if (appliances[i].id == applianceId) {
      applianceIdx = i;
      break;
    }
  }
  if (appliances[applianceIdx].status === 1) {
    appliances[applianceIdx].usage[appliances[applianceIdx].usage.length - 1].end = Date.now();
    appliances[applianceIdx].status = 0;
  } else {
    appliances[applianceIdx].usage.push({'start': Date.now()});
    appliances[applianceIdx].status = 1;
  }
}