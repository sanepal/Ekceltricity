var db = require('../db');

exports.view = function(req, res) {
  res.render('create', {'title' : 'Create a New Household'});
}

exports.create = function(req, res) {
  var household = req.body;
  var members = [];

  // Create new users or find the existing ones
  household.members.forEach(function(email) {
    if (email === '') {
      return;
    }
    var member = db.createOrGetUser(email);
    members.push(member.id);
  });

  // Add current user to household
  members.push(req.userId);
  household.members = members;
  household.appliances = [];
  db.createHousehold(household);

  // TODO: Redirect to my appliances page for this household 
  res.redirect('/');
}