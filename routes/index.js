var db = require('../db');
var breakdown = require('../routes/breakdown');

exports.view = function(req, res) {
  var userId = req.session.userId;
  var households = db.getHouseholds();
  var applianceBreakdowns = [];
  var userHouseholds = [];
  households.forEach(function(h) {
    h.appliances = [];
    h.members.forEach(function(m) {
      if (m.id == userId) {
        m.appliances.forEach(function(a) {
          h.appliances.push(db.getAppliance(a));
        });
        userHouseholds.push(h);
        console.log("h id: " + h.id + ", userId: " + userId);
        var memberUsageData = breakdown.getUserUsageData(h, userId);
        console.log("applianceCosts: " + JSON.stringify(memberUsageData.applianceMonthCosts));
        applianceBreakdowns.push({'householdName':h.name, 'applianceCosts': memberUsageData.applianceMonthCosts});
      }
    });
  });
  res.render('index', {
    'title': 'Ekceltricity',
    'households': userHouseholds,
    'applianceBreakdowns': applianceBreakdowns
  });
}