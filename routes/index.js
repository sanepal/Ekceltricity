var db = require('../db');
var breakdown = require('../routes/breakdown');

exports.view = function(req, res) {
  var households = db.getHouseholds();
  var applianceBreakdowns = [];
  households.forEach(function(h) {
    h.appliances = [];
    h.members.forEach(function(m) {
      if (m.id == req.userId) {
        m.appliances.forEach(function(a) {
          h.appliances.push(db.getAppliance(a));
        });
        console.log("h id: " + h.id + ", " + req.userId);
        var memberUsageData = breakdown.getUserUsageData(h, req.userId);
        console.log("applianceCosts: " + JSON.stringify(memberUsageData.applianceMonthCosts));
        applianceBreakdowns.push({'householdName':h.name, 'applianceCosts': memberUsageData.applianceMonthCosts});
      }
    });
  });

  res.render('index', {
    'title': 'Ekceltricity',
    'households': households,
    'applianceBreakdowns': applianceBreakdowns
  });
}