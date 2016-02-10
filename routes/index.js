var db = require('../db');

exports.view = function(req, res) {
  var households = db.getHouseholds();
  res.render('index', {
    title: 'Ekceltricity',
    households
  });
}