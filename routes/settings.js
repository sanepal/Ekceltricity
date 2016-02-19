var db = require('../db');

exports.view = function(req, res) {
	req.session.messages = [];
 	res.render('settings', {'title' : 'Settings'});
}

exports.changePassword = function(req, res) {
	var oldPassword = req.body.oldPassword;
	var newPassword = req.body.newPassword;
	var confirmPassword = req.body.confirmPassword;
	var email = req.session.email;
	console.log(email);
	if(newPassword === confirmPassword) {
		var success = db.changePassword(email, oldPassword, newPassword);
		if(success) {
			req.session.messages = [];
			req.session.messages.push("Password has been changed successfully");
			res.redirect('/settings');
		} else {
			req.session.messages = [];
			req.session.messages.push("error");
			req.session.messages.push("Invalid current password");
			res.redirect('/settings');
		}
	} else {
		req.session.messages = [];
		req.session.messages.push("error");
		req.session.messages.push("Password do not match");
		res.redirect('/settings');
	}
}