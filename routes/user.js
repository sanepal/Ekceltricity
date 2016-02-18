var db = require('../db');

exports.view = function(req, res) {

  res.render('sign-in', {
    'title': 'Ekceltricity'
  });
}

exports.signIn = function(req, res) {
	var email = req.body.email;
	var password = req.body.password;
	var success = db.signIn(email, password);
	console.log(success);
}

exports.signUp = function(req, res) {
	var name = req.body.name;
	var email = req.body.email;
	var password = req.body.password;

	var success = db.createOrGetUser(name, email, password);
	console.log(success);
	if(success != undefined) {
		//show success 
	} else {
		res.send("account already exists");
	}
}