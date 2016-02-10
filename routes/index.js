var households = require('../data/households.json');

exports.view = function(req, res) {
  res.render('index', {
    title: 'Ekceltricity',
    households
  });
}