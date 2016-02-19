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

exports.viewUser = function(req, res) {
    console.log("IN my-overview.js.view with memberId: " + req.params.member);
    var userId = req.session.userId;
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

    var readOnly = memberId != userId;
    console.log(readOnly);

    var title = household.name + " > " + (readOnly ? member.name + "'s Usage" : 'My Usage');
    res.render('my-overview', {'title': title, 'household': household, 'member': member, 'appliances': appliances, readOnly: readOnly});
}