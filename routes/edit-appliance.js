var db = require('../db');

exports.view = function(req, res) {
	var applianceId = req.params.applianceId;
	var appliance = db.getAppliance(applianceId);
	if (appliance.owner != req.userId) {
		// people can't edit appliances that do not belong to them
		console.log("first check problem");
		return;
	}
	var household = db.getHousehold(req.params.household);
	if (household == null) {
		console.log("second check problem");
		return;
	}
	var userIdx = -1;
	for (var i = 0; i < household.members.length; i++) {
		if (household.members[i].id == req.userId) {
			userIdx = i;
			break;
		}
	}
	if (userIdx == -1) {
		console.log("third check problem");
		return;
	}
	console.log("userId: " + req.userId + ", householdId: " + household.id + ", userIdx: " + userIdx + ", applianceId: " + applianceId);
	var validAppliance = false;
	for (var i = 0; i < household.members[userIdx].appliances.length; i++) {
		if (household.members[userIdx].appliances[i] == applianceId) {
			validAppliance = true;
			break;
		}
	}
	if (!validAppliance) {
		console.log("fourth check problem");
		return;
	}
	res.render('edit-appliance', {
		'householdName': household.name,
		'householdId':req.params.household, 
		'applianceId': applianceId, 
		'applianceName': appliance.name, 
		'applianceRate': appliance.rate
	});
}

exports.update = function(req, res) {
	console.log("Update appliance for applianceId: " + req.params.applianceId);
	var newName = req.body.name;
	var newRate = req.body.rate;
	db.updateAppliance(req.params.applianceId, newName, newRate);
	res.redirect('breakdown/' + req.params.householdId + '/' + req.userId);
}