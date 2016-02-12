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

exports.addAppliance = function(req, res) {
	console.log("addAppliance userId: " + req.userId);
	var applianceName = req.body.name;
	var applianceRate = req.body.rate;
	console.log("applianceName: " + applianceName + ", applianceRate: " + applianceRate);
	var applianceJson = 
	{
		"id":-1,
		"owner": req.userId,
		"name": applianceName,
		"rate": applianceRate,
		"usage":[],
		"status":0
	}
	var applianceId = db.createAppliance(applianceJson);
	if (applianceId == -1) {
		console.log("error adding appliance for user " + req.userId + " at household " + req.params.household);
		return;
	}
	db.addAppliance(req.params.household, req.userId, applianceId);
	res.redirect('/breakdown/' + req.params.household + '/' + req.userId);
}