var db = require('../db');

exports.view = function(req, res) {
	var memberId = req.params.member;
	var householdId = req.params.household;

	var household = db.getHousehold(householdId);
	var member = undefined;

  var appliances = [];
  
  household.members.forEach(function(m) {
    if (m.id == memberId) {
    	member = db.getUser(m.id);

    	if (m.appliances !== undefined) {
	      m.appliances.forEach(function(a) {
	        appliances.push(db.getAppliance(a));
	      });
	    }
    }
  });

  var title = household.name + " > " + (memberId == req.userId ? 'My Usage' : member.name + "'s Usage");

  res.locals.userId = req.userId;
	res.render('my-overview', {'title': title, 'household': household, 'member': member, 'appliances': appliances});
}