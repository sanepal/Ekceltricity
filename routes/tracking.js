var db = require('../db');

exports.toggle = function(req, res) {
  db.toggle(req.params.appliance);
}