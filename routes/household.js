var db = require('../db');

exports.view = function(req, res) {
  res.render('create', {'title' : 'Create a New Household'});
}

exports.create = function(req, res) {
  var userId = req.session.userId;
  var household = req.body;
  var members = [];

  // Create new users or find the existing ones
  if (household.members.length !== 0) {
    household.members.forEach(function(email) {
      if (email === '') {
        return;
      }
      var member = db.createOrGetUser(email, email, null);

      console.log(member);
      members.push({'id': member.id, 'appliances': []});
    });
  }

  // Add current user to household
  members.push({'id': userId, 'appliances': []});
  household.members = members;
  var id = db.createHousehold(household);

  res.redirect('/breakdown/' + id + '/' + userId);
}

exports.viewOptions = function(req, res) {
  var householdId = req.params.household;
  var household = db.getHousehold(householdId);

  var members = [];
  household.members.forEach(function(e) {
    var member = db.getUser(e.id);
    members.push(member);
  });

  res.render('household-options', {'title': household.name + " Settings", 'household': household, 'members': members});
}

exports.update = function(req, res) {
  var householdId = req.body.id;
  var existingHousehold = db.getHousehold(householdId);

  var currentMembers = existingHousehold.members;
  var existingMembers = req.body.existingMembers;
  var newMembers = req.body.newMembers;
  var members = [];

  // Merge the existing users 
  if (existingMembers !== undefined) {
    for (var i = 0; i < existingMembers.length; i++) {
      var member = db.getUser(existingMembers[i]);
      for (var j = 0; j < currentMembers.length; j++) {
        if (member.id == currentMembers[j].id) {
          members.push(currentMembers[j]);
        }
      }
    }
  }

  // Add the new members
  newMembers.forEach(function(email) {
    if (email === '') {
      return;
    }
    var member = db.createOrGetUser(email, email, null);
    members.push({'id': member.id, 'appliances': []});
  });

  var household = {};
  household.members = members;
  household.id = req.body.id;
  household.rate = req.body.rate;
  household.name = req.body.householdName;
  db.editHousehold(household);

  res.redirect('/breakdown/' + household.id);
}