var db = require('../db');

exports.view = function(req, res) {
  var userId = req.session.userId;
  var households = db.getHouseholds();
  var userHouseholds = [];

  households.forEach(function(h) {
    h.appliances = [];
    h.members.forEach(function(m) {
      if (m.id == userId) {
        m.appliances.forEach(function(a) {
          h.appliances.push(db.getAppliance(a));
        });
        userHouseholds.push(h);
      }
    });
  });

  res.render('index', {
    'title': 'Ekceltricity',
    'households': userHouseholds
  });
}