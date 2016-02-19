var db = require('../db.js');

/** accepts a null endDate */
function getUsageMillis(startDate, endDate, now) {
	// if it was started in another month and ended in another month, don't show
    // this also doesn't check years, but who cares
    if (startDate.getMonth() != now.getMonth() && endDate != null && endDate.getMonth() != now.getMonth()) {
        return 0;
    }
    // started but hasn't ended yet, use now as end date
    if (endDate == null) {
    	endDate = now;
    }
    // if it was started in another month and rolled over to this month, use the start of this month
    if (startDate.getMonth() != endDate.getMonth() && endDate.getMonth() == now.getMonth()) {
        startDate = new Date(now.getYear(), now.getMonth(), 1);
    }
    return endDate.getTime() - startDate.getTime();
}

function millisToHours(millis) {
    return millis / 1000 / 60 / 60;
}

/*
	Used to get the data in the main Household Breakdown page
*/
function getTotalUsageThisMonth(household) {
    var totalUsage = 0;
    var totalCost = 0;
    var mostMemberName, mostApplianceName, mostApplianceAmount = 0, mostApplianceCost;
    var memberBreakdown = [];
    var now = new Date(Date.now());
    household.members.forEach(function(m) {
        var member = db.getUser(m.id);
        var memberUsage = 0;
        if (m.appliances !== undefined) {
            m.appliances.forEach(function(a) {
            	var applianceUsage = 0;
                var appliance = db.getAppliance(a);
                for (var i = 0; i < appliance.usage.length; i++) {
                    var startDate = new Date(appliance.usage[i].start);
                    var endDate = appliance.usage[i].end == null ? null : new Date(appliance.usage[i].end);
                    var toAdd = millisToHours(getUsageMillis(startDate, endDate, now)) * appliance.rate;
                    memberUsage += toAdd;
                    applianceUsage += toAdd;
                }
                if (applianceUsage > mostApplianceAmount) {
                	mostApplianceAmount = Math.round((applianceUsage + 0.00001) * 100) / 100;
                	mostApplianceName = appliance.name;
                	mostMemberName = member.name;
                	mostApplianceCost = Math.round(mostApplianceAmount * household.rate + 0.00001) / 100;
                }
            });
        }
        memberBreakdown.push({'name':member.name, 'usage':memberUsage});
        member.monthUsage = Math.round(memberUsage * household.rate + 0.00001) / 100;
        totalCost += member.monthUsage;
        totalUsage += memberUsage;
    });
	totalCost = Math.round((totalCost + 0.00001) * 100) / 100;
	totalUsage = Math.round((totalUsage + 0.00001) * 100) / 100;
    return {"totalUsage":totalUsage, 
    		"totalCost":totalCost, 
    		"mostMemberName":mostMemberName, 
    		"mostApplianceName":mostApplianceName, 
    		"mostApplianceAmount":mostApplianceAmount, 
    		"mostApplianceCost":mostApplianceCost, 
    		"memberBreakdown":memberBreakdown
    	};
}

/*
	Used to get the usage data over the past week from now, in a breakdown format of each member:
	{totalUsage:x, breakdown: {[{name:rahul, usage: 1.3}]}} etc.
	Used in the member's overview page for more accurate statistics, and also in the daily usage graph in Household.
*/
function getWeekUsageBreakdown(household, now) {
	var dayBreakdown = [];
	for (var i = 0; i < 7; i++) {
		dayBreakdown.push([]);
	}
	household.members.forEach(function(m) {
		var member = db.getUser(m.id);
		for (var i = 0; i < 7; i++) {
			dayBreakdown[i].push({'name':member.name, 'usage':0});
		}
		if (m.appliances !== undefined) {
			m.appliances.forEach(function(a) {
				var appliance = db.getAppliance(a);
				for (var i = 0; i < appliance.usage.length; i++) {
					var startDate = new Date(appliance.usage[i].start);
					var endDate = appliance.usage[i].end == null ? null : new Date(appliance.usage[i].end);
					// if it started before the week, set start date to the start of the week
					if (startDate.getMonth() != now.getMonth() || startDate.getDate() < now.getDate() - 6) {
						startDate = new Date(now.getYear(), now.getMonth(), now.getDate() - 6);
						// if end date was before the start of the week, ignore this usage
						if (endDate != null && endDate.getMonth() != now.getMonth() || endDate.getDate() < now.getDate() - 6) {
							continue;
						}
					}
					for (var j = 6 - (now.getDate() - startDate.getDate()); j < 7; j++) {
						var hitEnd = false;
						var iendDate = new Date(now.getYear(), now.getMonth(), startDate.getDate(), 23, 59, 59, 999);
						if (endDate != null && endDate.getTime() < iendDate.getTime()) {
							iendDate = endDate;
							hitEnd = true;
						} else if (j == 6) {
							iendDate = endDate == null ? now : endDate;
						}
						for (var k = 0; k < dayBreakdown[j].length; k++) {
							if (dayBreakdown[j][k].name == member.name) {
								dayBreakdown[j][k].usage += millisToHours(iendDate - startDate) * appliance.rate;
								break;
							}
						}
						if (hitEnd) {
							break;
						}
						startDate = new Date(startDate.getYear(), startDate.getMonth(), startDate.getDate() + 1);
					}
				}
			});
		}
	});
	return dayBreakdown;
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
	var totalMonthUsage = getTotalUsageThisMonth(household);
	console.log("totalMonthUsage:\n" + JSON.stringify(totalMonthUsage));
	var weekBreakdown = getWeekUsageBreakdown(household, new Date(Date.now()));
	console.log("dayBreakdown:\n" + JSON.stringify(weekBreakdown));
	res.render('breakdown', {'title': household.name, 'household': household, 'members': members, 'totalMonthUsage': totalMonthUsage, 'weekBreakdown': weekBreakdown});
}

var getUserUsageData = function(household, memberId) {
	var member = undefined;
	console.log("household: " + JSON.stringify(household) + ", memberId: " + memberId);
    var appliances = [];
    // values are {'name', 'totalUsage'} tuples which have usage for each appliance, e.g. {'Laptop', '1.23'}
    var memberApplianceUsage = [];
    var memberUsage = 0;
    var now = new Date(Date.now());
    var applianceMonthCosts = [];
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
                        var endDate = appliance.usage[i].end == null ? null : new Date(appliance.usage[i].end);
                        totalUsage += millisToHours(getUsageMillis(startDate, endDate, now)) * appliance.rate;
                    }
                    memberApplianceUsage.push({"applianceName":appliance.name, "totalUsage":totalUsage});
                    var cost = Math.round(totalUsage * household.rate + 0.00001) / 100;
                    applianceMonthCosts.push({"applianceName":appliance.name, "cost":cost});
                });
                
            }
        }
    });
	return {'member': member, 'appliances': appliances, 'memberApplianceUsage':memberApplianceUsage, 'applianceMonthCosts':applianceMonthCosts};
}

exports.getUserUsageData = getUserUsageData;

exports.viewUser = function(req, res) {
    var memberId = req.params.member;
    var householdId = req.params.household;

    var household = db.getHousehold(householdId);
    var userUsageData = getUserUsageData(household, memberId);
    
    console.log("Sending memberUsageAmounts: " + JSON.stringify(userUsageData.memberApplianceUsage));
    var weekBreakdown = getWeekUsageBreakdown(household, new Date(Date.now()));
    var title = household.name + " > " + (memberId == req.userId ? 'My Usage' : member.name + "'s Usage");
    res.render('my-overview', {
    			'title': title, 
    			'household': household, 
    			'member': userUsageData.member, 
    			'appliances': userUsageData.appliances, 
    			'memberApplianceUsage':userUsageData.memberApplianceUsage, 
    			'weekBreakdown':weekBreakdown,
    			'applianceMonthCosts':userUsageData.applianceMonthCosts});
}