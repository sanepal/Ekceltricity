var db = require('../db');

exports.view = function(req, res) {

  res.render('sign-in', {
    'title': 'Ekceltricity'
  });
}