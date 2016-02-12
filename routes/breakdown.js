var db = require('../db.js');

exports.view = function(req, res) {
	var householdId = req.params.household;
	var household = db.getHousehold(householdId);

	var members = [];
	household.members.forEach(function(e) {
		var member = db.getUser(e.id);
		member['monthUsage'] = 10.56;
		members.push(member);
	});

	res.render('breakdown', {'title': household.name, 'household': household, 'members': members});
}