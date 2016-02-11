var db = require('../db');

exports.view = function(req, res) {
  var households = db.getHouseholds();

  households.forEach(function(h) {
    h.appliances = [];
    h.members.forEach(function(m) {
      if (m.id == req.userId) {
        m.appliances.forEach(function(a) {
          h.appliances.push(db.getAppliance(a));
        });
      }
    });
  });

  res.render('index', {
    'title': 'Ekceltricity',
    'households': households
  });
}