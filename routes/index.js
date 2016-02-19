var db = require('../db');

exports.view = function(req, res) {
  var userId = req.session.userId;
  var households = db.getHouseholds();

  households.forEach(function(h) {
    h.appliances = [];
    h.members.forEach(function(m) {
      if (m.id == userId) {
        m.appliances.forEach(function(a) {
          h.appliances.push(db.getAppliance(a));
        });
      }
    });
  });
  if(res.locals.userId) {
    res.render('index', {
      'title': 'Ekceltricity',
      'households': households
    });
  } else {
    res.redirect('/welcome');
  }
}