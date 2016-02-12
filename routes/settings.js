var db = require('../db');

exports.view = function(req, res) {
  res.render('settings', {'title' : 'Settings'});
}

exports.create = function(req, res) {

}