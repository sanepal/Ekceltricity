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
  var household = {};
  var members = [];
  var existingMembers = req.body.existingMembers;
  var newMembers = req.body.newMembers;

  // Create new users or find the existing ones
  // { householdName: 'College Household',
  // id: '0',
  // rate: '16.35',
  // existingMembers: [ '0', '1', '2', '3' ],
  // newMembers: [ '' ] }
  newMembers.forEach(function(email) {
    if (email === '') {
      return;
    }
    var member = db.createOrGetUser(email, email, null);
    members.push({'id': member.id, 'appliances': []});
  });

  existingMembers.forEach(function(email) {
    if (email === '') {
      return;
    }
    var member = db.getUser(email);
    members.push({'id': member.id, 'appliances': []});
  });

  // Add current user to household
  // members.push({'id': userId, 'appliances': []});
  household.members = members;
  household.id = req.body.id;
  household.rate = req.body.rate;
  household.name = req.body.householdName;
  db.editHousehold(household);

  // TODO: Redirect to my appliances page for this household 
  res.redirect('/breakdown/' + household.id);
}