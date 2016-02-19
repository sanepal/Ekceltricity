var db = require('../db');

exports.edit = function(req, res) {
    var userId = req.session.userId;
    var applianceId = req.params.applianceId;
    var appliance = db.getAppliance(applianceId);
    if (appliance.owner != userId) {
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
        if (household.members[i].id == userId) {
            userIdx = i;
            break;
        }
    }
    if (userIdx == -1) {
        console.log("third check problem");
        return;
    }
    console.log("userId: " + userId + ", householdId: " + household.id + ", userIdx: " + userIdx + ", applianceId: " + applianceId);
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
    var userId = req.session.userId;
    console.log("addAppliance userId: " + userId);
    var applianceName = req.body.name;
    var applianceRate = req.body.rate;
    console.log("applianceName: " + applianceName + ", applianceRate: " + applianceRate);
    var applianceJson = 
    {
        "id":-1,
        "owner": userId,
        "name": applianceName,
        "rate": applianceRate,
        "usage":[],
        "status":0
    }
    var applianceId = db.createAppliance(applianceJson);
    if (applianceId == -1) {
        console.log("error adding appliance for user " + userId + " at household " + req.params.household);
        return;
    }
    db.addAppliance(req.params.household, userId, applianceId);
    res.redirect('/breakdown/' + req.params.household + '/' + userId);
}

exports.toggle = function(req, res) {
    db.toggle(req.params.appliance);
}

exports.update = function(req, res) {
    console.log("Update appliance for applianceId: " + req.params.applianceId);
    var newName = req.body.name;
    var newRate = req.body.rate;
    var userId = req.session.userId;
    db.updateAppliance(req.params.applianceId, newName, newRate);
    res.redirect('/breakdown/' + req.params.householdId + '/' + userId);
}

exports.delete = function(req, res) {
    var applianceId = req.params.applianceId;
    var userId = req.session.userId;
    db.deleteAppliance(req.params.householdId, applianceId);
    res.redirect('/breakdown/' + req.params.householdId + '/' + userId);
}