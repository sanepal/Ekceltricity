var db = require('../db');

exports.viewSignIn = function(req, res) {
  res.render('sign-in', {
    'title': 'Ekceltricity'
  });
}

exports.viewSignUp = function(req, res) {
  res.render('sign-up', {
    'title': 'Ekceltricity'
  });
}

exports.viewWelcome = function(req, res) {
  res.render('welcome', {
    'title': 'Ekceltricity'
  });
}

exports.signIn = function(req, res) {
	var email = req.body.email;
	var password = req.body.password;
	var success = db.signIn(email, password);
	req.session.userId = success;
	res.redirect('/');
}

exports.signUp = function(req, res) {
	var name = req.body.name;
	var email = req.body.email;
	var password = req.body.password;

	var success = db.createOrGetUser(name, email, password);
	if(success !== undefined) {
		req.session.userId = db.signIn(email, password);
		res.redirect('/');
	} else {
		//show error message
	}
}

exports.logout = function(req, res) {
	req.session.userId = null;
    req.session.destroy();
	res.redirect('/');
}


