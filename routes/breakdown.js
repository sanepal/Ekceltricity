var householdMembers = require('../data/householdMembers.json')

exports.view = function(req, res) {
	var data = householdMembers;
	for (var i = 0; i < householdMembers.length; i++) {
		if (householdMembers[i].householdName == 'College Household') {
			data = householdMembers[i];
			break;
		}
	}
	if (data == householdMembers) {
		console.log('Unable to find correct household');
	}
	res.render('breakdown', data);
}