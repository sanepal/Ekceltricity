var db = require('../db');

exports.view = function(req, res) {
  res.render('create', {'title' : 'Create a New Household'});
}

exports.create = function(req, res) {
  var household = req.body;
  var members = [];

  // Create new users or find the existing ones
  if (household.members.length !== 0) {
    household.members.forEach(function(email) {
      if (email === '') {
        return;
      }
      var member = db.createOrGetUser(email);
      members.push({'id': member.id, 'appliances': []});
    });
  }

  // Add current user to household
  members.push({'id': req.userId, 'appliances': []});
  household.members = members;
  var id = db.createHousehold(household);

  // TODO: Redirect to my appliances page for this household 
  res.redirect('/breakdown/' + id + '/' + req.userId);
}