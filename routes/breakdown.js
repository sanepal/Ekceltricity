var db = require('../db.js');

function getTotalUsageThisMonth(household) {
    var totalUsage = 0;
    var memberBreakdown = [];
    household.members.forEach(function(m)) {
        var member = db.getUser(m.id);
        if (m.appliances !== undefined) {
            m.appliances.forEach(function(a)) {
                var appliance = db.getAppliance(a);
                for (var i = 0; i < appliance.usage.length; i++) {
                    
                }
            }
        }
    }
    return {"totalUsage":totalUsage, "memberBreakdown":memberBreakdown}
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
    var memberApplianceUsage = [];
    var totalUsageAmounts = [0, 0, 0, 0, 0, 0, 0];
    var memberUsage = 0;
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
                        var endDate = appliance.usage[i].end;
                        var now = Date.now();
                        // if it was started in another month and ended in another month, don't show
                        // this also doesn't check years, but who cares
                        if (startDate.getMonth() != now.getMonth() && endDate != null && endDate.getMonth() != now.getMonth()) {
                            continue;
                        }
                        // now determine if it was started in another month and rolled over to this month (in which case we would use the start of this month as the start date)
                        if (startDate.getMonth() != endDate.getMonth() && endDate.getMonth() == now.getMonth()) {
                            startDate = new Date(now.getYear(), now.getMonth(), 1);
                        } else if (endDate == null) { // started but didn't end yet, use now as end date
                            endDate = now;
                        }
                        totalUsage += millisToHours(endDate.getTime() - startDate.getTime()) * appliance.rate;
                    }
                    memberApplianceUsage.push({"applianceName":appliance.name, "totalUsage":totalUsage});
                });
            }
        }
        // add total usage across all household members
        m.appliances.forEach(function(applianceId) {

        })
    });
    console.log("Sending memberUsageAmounts: " + JSON.stringify(memberApplianceUsage));
    var title = household.name + " > " + (memberId == req.userId ? 'My Usage' : member.name + "'s Usage");
    res.render('my-overview', {'title': title, 'household': household, 'member': member, 'appliances': appliances, 'memberApplianceUsage':memberApplianceUsage});
}