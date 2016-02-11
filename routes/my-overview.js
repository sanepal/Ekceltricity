var appliances = require('../data/default.appliances.json');

exports.view = function(req, res) {
	// Use to retrieve data
	var householdId = req.params.household;
	var userId = req.params.userId;

	var data = appliances;
	for (var i = 0; i < appliances.length; i++) {
		if (appliances[i].householdName == 'College Household') {
			data = appliances[i];
		}
	}
	if (data == appliances) {
		console.log('Unable to find correct household for appliances');
	}
	res.render('my-overview', data);
}