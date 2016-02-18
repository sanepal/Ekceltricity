var db = require('../db');

exports.edit = function(req, res) {
    var applianceId = req.params.applianceId;
    var appliance = db.getAppliance(applianceId);
    if (appliance.owner != req.userId) {
        // people can't edit appliances that do not belong to them
        console.log("first check problem");
        return;
    }
    var household = db.getHousehold(req.params.household);
    if (household == null) {
        console.log("second check problem");
        return;
    }
    var userIdx = -1;
    for (var i = 0; i < household.members.length; i++) {
        if (household.members[i].id == req.userId) {
            userIdx = i;
            break;
        }
    }
    if (userIdx == -1) {
        console.log("third check problem");
        return;
    }
    console.log("userId: " + req.userId + ", householdId: " + household.id + ", userIdx: " + userIdx + ", applianceId: " + applianceId);
    var validAppliance = false;
    for (var i = 0; i < household.members[userIdx].appliances.length; i++) {
        if (household.members[userIdx].appliances[i] == applianceId) {
            validAppliance = true;
            break;
        }
    }
    if (!validAppliance) {
        console.log("fourth check problem");
        return;
    }
    res.render('edit-appliance', {
        'householdName': household.name,
        'householdId':req.params.household, 
        'applianceId': applianceId, 
        'applianceName': appliance.name, 
        'applianceRate': appliance.rate
    });
}

exports.add = function(req, res) {
    console.log("addAppliance userId: " + req.userId);
    var applianceName = req.body.name;
    var applianceRate = req.body.rate;
    console.log("applianceName: " + applianceName + ", applianceRate: " + applianceRate);
    var applianceJson = 
    {
        "id":-1,
        "owner": req.userId,
        "name": applianceName,
        "rate": applianceRate,
        "usage":[],
        "status":0
    }
    var applianceId = db.createAppliance(applianceJson);
    if (applianceId == -1) {
        console.log("error adding appliance for user " + req.userId + " at household " + req.params.household);
        return;
    }
    db.addAppliance(req.params.household, req.userId, applianceId);
    res.redirect('/breakdown/' + req.params.household + '/' + req.userId);
}

exports.toggle = function(req, res) {
  db.toggle(req.params.appliance);
}

exports.update = function(req, res) {
    console.log("Update appliance for applianceId: " + req.params.applianceId);
    var newName = req.body.name;
    var newRate = req.body.rate;
    db.updateAppliance(req.params.applianceId, newName, newRate);
    res.redirect('/breakdown/' + req.params.householdId + '/' + req.userId);
}

exports.delete = function(req, res) {
    var applianceId = req.params.applianceId;
    db.deleteAppliance(req.params.householdId, applianceId);
    res.redirect('/breakdown/' + req.params.householdId + '/' + req.userId);
}