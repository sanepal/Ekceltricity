var db = require('../db.js');

function getTotalUsageThisMonth(var household) {

}

function millisToHours(millis) {
    return millis / 1000 / 60 / 60;
}

exports.view = function(req, res) {
	var householdId = req.params.household;
	var household = db.getHousehold(householdId);

	var members = [];
	household.members.forEach(function(e) {
		var member = db.getUser(e.id);
		member['monthUsage'] = 10.56;
		members.push(member);
	});

	res.render('breakdown', {'title': household.name, 'household': household, 'members': members});
}

exports.viewUser = function(req, res) {
    var memberId = req.params.member;
    var householdId = req.params.household;

    var household = db.getHousehold(householdId);
    var member = undefined;

    var appliances = [];
    // values are {'name', 'totalUsage'} tuples which have usage for each appliance, e.g. {'Laptop', '1.23'}
    var memberUsageAmounts = [];
    var totalUsageAmounts = [0, 0, 0, 0, 0, 0, 0];
    household.members.forEach(function(m) {
        if (m.id == memberId) {
            member = db.getUser(m.id);
            if (m.appliances !== undefined) {
                m.appliances.forEach(function(a) {
                    var appliance = db.getAppliance(a);
                    appliances.push(appliance);
                    var totalUsage = 0;
                    for (var i = 0; i < appliance.usage.length; i++) {
                        var startDate = new Date(appliance.usage[i].start);
                        if (appliance.usage[i].end == null) {
                            totalUsage += ((Date.now() - startDate) / 1000 / 60 / 60) * appliance.rate;
                            continue;
                        }
                        var timeInMillis = appliance.usage[i].end - appliance.usage[i].start;
                        if (timeInMillis != undefined) {
                            totalUsage += (timeInMillis / 1000 / 60 / 60) * appliance.rate;
                        }
                    }
                    memberUsageAmounts.push({"applianceName":appliance.name, "totalUsage":totalUsage});
                });
            }
        }
        // add total usage across all household members
        m.appliances.forEach(function(applianceId) {

        })
    });
    console.log("Sending memberUsageAmounts: " + JSON.stringify(memberUsageAmounts));
    var title = household.name + " > " + (memberId == req.userId ? 'My Usage' : member.name + "'s Usage");
    res.render('my-overview', {'title': title, 'household': household, 'member': member, 'appliances': appliances, 'memberUsageAmounts':memberUsageAmounts});
}