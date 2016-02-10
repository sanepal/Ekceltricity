var db = require('../db');

exports.view = function(req, res) {
    res.render('create', {'title' : 'Create a New Household'});
}

exports.create = function(req, res) {
    var household = req.body;
    household.appliances = [];
    db.createHousehold(household);

    // TODO: Redirect to my appliances page for this household 
    res.redirect('/');
}