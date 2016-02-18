var db = require('../db');

exports.view = function(req, res) {

  res.render('welcome', {
    'title': 'Ekceltricity'
  });
}