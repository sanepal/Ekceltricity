var db = require('../db');

exports.viewSignIn = function(req, res) {
	req.session.messages = [];
	res.render('sign-in', {'title': 'Ekceltricity'});
}

exports.viewSignUp = function(req, res) {
	req.session.messages = [];
	res.render('sign-up', {'title': 'Ekceltricity'});
}

exports.viewWelcome = function(req, res) {
  res.render('welcome', {
    'title': 'Ekceltricity'
  });
}

exports.viewWelcome2 = function(req, res) {
	res.render('welcome2', {'title': 'Ekceltricity'});
}

exports.signIn = function(req, res) {
	var email = req.body.email;
	var password = req.body.password;
	var success = db.signIn(email, password);
	if(success >= 0) {
		req.session.userId = success;
		req.session.email = email;
		res.redirect('/');
	} else {
		req.session.messages = [];
		req.session.messages.push("Invalid email/password combination");
		res.redirect('/login');
	}
}

exports.signUp = function(req, res) {
	var name = req.body.name;
	var email = req.body.email;
	var password = req.body.password;

	var success = db.createOrGetUser(name, email, password);
	if(success !== undefined) {
		req.session.userId = db.signIn(email, password);
		req.session.email = email;
		res.redirect('/');
	} else {
		req.session.messages = [];
		req.session.messages.push("Account already exists");
		res.redirect('/signup');
	}
}

exports.logout = function(req, res) {
	req.session.userId = null;
    req.session.destroy();
	res.redirect('/');
}


