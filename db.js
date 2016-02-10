var households = require('./data/households.json');

exports.getHouseholds = function() {
    return households;
}

exports.createHousehold = function(data) {
    data.id = households.length;
    households.push(data);
}