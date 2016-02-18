var db = require('../db');

exports.view = function(req, res) {
	var applianceId = req.params.applianceId;
	db.deleteAppliance(req.params.householdId, applianceId);
	res.redirect('/breakdown/' + req.params.householdId + '/' + req.userId);
}