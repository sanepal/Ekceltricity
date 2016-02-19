var db = require('../db');
var breakdown = require('../routes/breakdown');

exports.view = function(req, res) {
  var userId = req.session.userId;
  var households = db.getHouseholds();
  var applianceBreakdowns = [];
  households.forEach(function(h) {
    h.appliances = [];
    h.members.forEach(function(m) {
      if (m.id == userId) {
        m.appliances.forEach(function(a) {
          h.appliances.push(db.getAppliance(a));
        });
        console.log("h id: " + h.id + ", " + req.userId);
        var memberUsageData = breakdown.getUserUsageData(h, userId);
        console.log("applianceCosts: " + JSON.stringify(memberUsageData.applianceMonthCosts));
        applianceBreakdowns.push({'householdName':h.name, 'applianceCosts': memberUsageData.applianceMonthCosts});
      }
    });
  });
  if (res.locals.userId) {
    res.render('index', {
      'title': 'Ekceltricity',
      'households': households,
      'applianceBreakdowns': applianceBreakdowns
    });
  } else {
    res.redirect('/welcome');
  }
}